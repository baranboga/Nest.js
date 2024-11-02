import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested, IsBoolean, IsNumber, IsInt } from 'class-validator';

// QuestionContent için class
export class QuestionContentDto {
  @ApiProperty({
    description: 'Content of the question option',
    example: 'This is an answer option'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Whether this option is correct or not',
    example: true
  })
  @IsBoolean()
  isCorrect: boolean;
}

// CreateQuestion için class
export class CreateQuestionDto {
  @ApiProperty({
    description: 'Title of the question',
    example: 'What is TypeScript?'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Latitude of the question',
    example: 37.7749
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude of the question',
    example: -122.4194
  })
  @IsNumber()
  lng: number;

  @ApiProperty({
    description: 'Category ID of the question',
    example: 1
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: 'Question contents/options',
    type: [QuestionContentDto],
    example: [
      {
        content: 'First option',
        isCorrect: true
      },
      {
        content: 'Second option',
        isCorrect: false
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionContentDto)
  questionContents: QuestionContentDto[];
}

