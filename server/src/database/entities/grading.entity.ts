import {
    Collection,
    Embeddable,
    Embedded,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { MapType } from '../types/MapType';
import { Scheinexam } from './scheinexam.entity';
import { Sheet } from './sheet.entity';
import { ShortTest } from './shorttest.entity';
import { Student } from './student.entity';

@Embeddable()
export class ExerciseGrading {
    @Property()
    points!: number;

    @Property({ type: MapType })
    subExercisePoints!: Map<string, number>;

    @Property()
    comment?: string;

    @Property({ type: 'double precision' })
    additionalPoints?: number;
}

@Entity()
export class Grading {
    @PrimaryKey()
    id = v4();

    @Property({ type: 'double precision' })
    additionalPoints: number = 0;

    @Property()
    comment?: string;

    @Embedded({ array: true })
    exerciseGrading: ExerciseGrading[] = [];

    @ManyToOne()
    sheetId?: Sheet;

    @ManyToOne()
    examId?: Scheinexam;

    @ManyToOne()
    shortTestId?: ShortTest;

    @ManyToMany(() => Student, 'gradings')
    students = new Collection<Student>(this);
}