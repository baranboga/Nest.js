import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Sorunun başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsString()
  @IsNotEmpty()
  question1: string;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsString()
  @IsNotEmpty()
  question2: string;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsString()
  @IsNotEmpty()
  question3: string;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ description: 'Kategori ID\'si' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
