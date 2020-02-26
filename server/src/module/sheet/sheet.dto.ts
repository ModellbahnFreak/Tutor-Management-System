import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ISheetDTO, ISubexerciseDTO } from '../../shared/model/Sheet';

export class SubExerciseDTO implements ISubexerciseDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  exName!: string;

  @IsNumber()
  @Min(0)
  maxPoints!: number;

  @IsBoolean()
  bonus!: boolean;
}

export class ExerciseDTO extends SubExerciseDTO {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubExerciseDTO)
  subexercises?: SubExerciseDTO[];
}

export class SheetDTO implements ISheetDTO {
  @IsNumber()
  sheetNo!: number;

  @IsBoolean()
  bonusSheet!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDTO)
  exercises!: ExerciseDTO[];
}