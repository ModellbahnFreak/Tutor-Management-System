import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { Student } from '../../shared/model/Student';
import { StudentDTO, CakeCountDTO } from './student.dto';
import { StudentService } from './student.service';
import { Role } from '../../shared/model/Role';
import { HasRoleGuard } from '../../guards/has-role.guard';
import { StudentGuard } from '../../guards/student.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(new HasRoleGuard([Role.ADMIN, Role.EMPLOYEE]))
  async getAllStudents(): Promise<Student[]> {
    const students = await this.studentService.findAll();

    return students;
  }

  @Post()
  @UseGuards(new HasRoleGuard([Role.ADMIN, Role.TUTOR]))
  @UsePipes(ValidationPipe)
  async createStudent(@Body() dto: StudentDTO): Promise<Student> {
    // TODO: Guard -- Check if the student is created IN the tutorial of the calling tutor.
    const student = await this.studentService.create(dto);

    return student;
  }

  @Get('/:id')
  @UseGuards(StudentGuard)
  async getStudent(@Param('id') id: string): Promise<Student> {
    const student = await this.studentService.findById(id);

    return student.toDTO();
  }

  @Patch('/:id')
  @UseGuards(StudentGuard)
  @UsePipes(ValidationPipe)
  async updateStudent(@Param('id') id: string, @Body() dto: StudentDTO): Promise<Student> {
    const student = await this.studentService.update(id, dto);

    return student;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(StudentGuard)
  async deleteStudent(@Param('id') id: string) {
    await this.studentService.delete(id);
  }

  @Put('/:id/cakecount')
  @UseGuards(StudentGuard)
  @UsePipes(ValidationPipe)
  async updateCakeCount(@Param('id') id: string, @Body() dto: CakeCountDTO): Promise<void> {
    await this.studentService.setCakeCount(id, dto);
  }
}
