import { EntityManager } from '@mikro-orm/mysql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Grading } from '../../database/entities/grading.entity';
import { HandIn } from '../../database/entities/ratedEntity.entity';
import { Student } from '../../database/entities/student.entity';
import { ScheinexamService } from '../scheinexam/scheinexam.service';
import { SheetService } from '../sheet/sheet.service';
import { ShortTestService } from '../short-test/short-test.service';
import { GradingDTO } from './student.dto';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { GradingList, GradingListsForStudents } from '../../helpers/GradingList';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class GradingService {
    constructor(
        @InjectRepository(Grading)
        private readonly gradingRepository: EntityRepository<Grading>,
        private readonly entityManager: EntityManager,
        private readonly sheetService: SheetService,
        private readonly scheinexamService: ScheinexamService,
        private readonly shortTestService: ShortTestService
    ) {}

    /**
     * @param studentId ID of the student to get the gradings for.
     *
     * @returns All gradings that this student has.
     */
    async findOfStudent(studentId: string): Promise<GradingList> {
        const gradings = await this.gradingRepository.find(
            { students: { $contains: [studentId] } },
            // TODO: Do we need the populate here?
            { populate: true }
        );
        return new GradingList(gradings);
    }

    /**
     * @param studentId ID of the student to get the grading for.
     * @param handInId ID of the hand-in to get the grading of.
     *
     * @returns Grading which matches the parameters. If there is no such grading `undefined` is returned instead.
     */
    async findOfStudentAndHandIn(
        studentId: string,
        handInId: string
    ): Promise<Grading | undefined> {
        const grading = await this.gradingRepository.findOne(
            {
                students: { $contains: [studentId] },
                $or: [{ sheet: handInId }, { shortTest: handInId }, { exam: handInId }],
            },
            // TODO: Do we need the populate here?
            true
        );

        return grading ?? undefined;
    }

    /**
     * @param studentIds IDs of all students to get the gradings for.
     *
     * @returns The gradings of the students with the given IDs.
     */
    async findOfMultipleStudents(studentIds: string[]): Promise<GradingListsForStudents> {
        // const gradings = await this.gradingRepository.find({
        //     students: { $contains: studentIds },
        // });
        // TODO: Can one use the "groupBy" option here instead of the code below to improve performance?
        const gradingLists = new GradingListsForStudents();
        for (const studentId of studentIds) {
            gradingLists.addGradingList(studentId, await this.findOfStudent(studentId));
        }
        return gradingLists;
    }

    /**
     * Finds and returns the gradings for the given team and hand-in.
     *
     * If there are no grading matching both, team and hand-in, an empty array is returned.
     *
     * @param team Team to get the gradings for.
     * @param handIn Hand-in to get the gradings of.
     *
     * @returns Gradings for the given team and hand-in as described above.
     */
    async findOfTeamAndHandIn(team: Team, handIn: HandIn): Promise<Grading[]> {
        const gradingList = await this.findOfMultipleStudents(team.getStudents().map((s) => s.id));
        const gradings = gradingList.getAllGradingsForHandIn(handIn);

        return gradings.filter((g) => g.belongsToTeam);
    }

    /**
     * Sets the grading of the given student.
     *
     * If the DTO indicates an update the corresponding grading will be updated.
     *
     * @param student Student to set the grading for.
     * @param dto DTO which resembles the grading.
     *
     * @see setOfMultipleStudents
     */
    async setOfStudent(student: Student, dto: GradingDTO): Promise<void> {
        return this.setOfMultipleStudents(new Map([[student, dto]]));
    }

    /**
     * Sets the grading of the given students to the one from the DTO.
     *
     * @param dtos Maps each student to the DTO of the grading which belongs to it.
     *
     * @throws `BadRequestException` - If an error occurs during the setting process of _any_ student this exception is thrown.
     */
    async setOfMultipleStudents(dtos: Map<Student, GradingDTO>): Promise<void> {
        const em = this.entityManager.fork(false);
        await em.begin();

        try {
            for (const [student, dto] of dtos) {
                const handIn = await this.getHandInFromDTO(dto);
                await this.updateGradingOfStudent({ student, dto, em, handIn });
            }
            await em.commit();
        } catch (e) {
            await em.rollback();
            throw new BadRequestException(e);
        }
    }

    /**
     * Updates the grading of a single student.
     *
     * The updated grading is just added to the given {@link EntityManager} but **NOT** written to the database.
     *
     * @param student Student to update the grading for.
     * @param dto DTO holding the information about the new grading.
     * @param handIn {@link HandIn} that belongs to the new grading.
     * @param em {@link EntityManager} responsible for managing the transaction.
     * @private
     */
    private async updateGradingOfStudent({
        student,
        dto,
        handIn,
        em,
    }: UpdateGradingParams): Promise<void> {
        const oldGrading = (await this.findOfStudent(student.id)).getGradingOfHandIn(handIn);
        const newGrading =
            !oldGrading || dto.createNewGrading ? new Grading({ handIn }) : oldGrading;

        newGrading.updateFromDTO({ dto, handIn });

        oldGrading?.students.remove(student);
        newGrading.students.add(student);

        if (!!oldGrading && oldGrading.students.length === 0) {
            em.remove(oldGrading);
        }
        em.persist(newGrading);
    }

    /**
     * Returns either a ScheinexamDocument or an ScheinexamDocument associated to the given DTO.
     *
     * If all fields, `sheetId`, `examId` and `shortTestId`, are set, an exception is thrown. An exception is also thrown if none of the both fields is set.
     *
     * @param dto DTO to return the associated document with exercises for.
     *
     * @returns Associated document with exercises.
     *
     * @throws `BadRequestException` - If either all fields (`sheetId`, `examId` and `shortTestId`) or none of those fields are set.
     */
    async getHandInFromDTO(dto: GradingDTO): Promise<HandIn> {
        const { sheetId, examId, shortTestId } = dto;

        if (!!sheetId && !!examId && !!shortTestId) {
            throw new BadRequestException(
                'You have to set exactly one of the three fields sheetId, examId and shortTestId - not all three.'
            );
        }

        if (!!sheetId) {
            return this.sheetService.findById(sheetId);
        }

        if (!!examId) {
            return this.scheinexamService.findById(examId);
        }

        if (!!shortTestId) {
            return this.shortTestService.findById(shortTestId);
        }

        throw new BadRequestException(
            'You have to either set the sheetId or the examId or the shortTestId field.'
        );
    }
}

interface UpdateGradingParams {
    student: Student;
    dto: GradingDTO;
    handIn: HandIn;
    em: EntityManager;
}
