import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DeleteQuestionDto {
  @ApiProperty({ description: 'Kullanıcının adı' })
  @IsInt()
  @IsNotEmpty()
  id: number;

}