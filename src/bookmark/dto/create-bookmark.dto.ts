import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Title of the bookmark',
    example: 'My favorite website',
    required: true
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
    example: 'https://example.com',
    required: true
  })
  @IsString()
  link: string;

  @ApiProperty({
    description: 'File to upload (jpeg, png, pdf only)',
    type: 'string',
    format: 'binary',  
    required: false
  })
  @IsOptional()
  file?: any;

  @ApiProperty({
    description: 'File URL after upload',
    required: false
  })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({
    description: 'Original file name',
    required: false
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({
    description: 'File MIME type',
    required: false
  })
  @IsString()
  @IsOptional()
  fileType?: string;
}
