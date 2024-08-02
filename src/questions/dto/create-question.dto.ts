import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Sorunun başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Sorunun içeriği' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Kategori ID\'si' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
