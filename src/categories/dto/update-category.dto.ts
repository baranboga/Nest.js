import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';
import { UpdateQuestionDto } from 'src/questions/dto/update.question.dto';

export class UpdateCategoryDto {


  @ApiProperty({
    description: 'Name of the category',
    example: 'Mathematics',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  //Bu alan swagger dökümantasyonu için çok önemli
  @ApiProperty({
    description: 'Questions in this category',
    type: [UpdateQuestionDto],  // Array tipini belirt
    required: false
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}