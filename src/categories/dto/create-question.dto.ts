import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Kullanıcının adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  
}