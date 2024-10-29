import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Title of the bookmark',
    example: 'My favorite website'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the bookmark',
    example: 'This is a great website about programming',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL of the bookmark',
    example: 'https://example.com'
  })
  @IsString()
  link: string;

}
