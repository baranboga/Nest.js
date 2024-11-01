import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class EditBookmarkDto {
  @ApiProperty({
    description: 'Updated title of the bookmark',
    example: 'My updated website title',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Updated description of the bookmark',
    example: 'Updated description of the website',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Updated URL of the bookmark',
    example: 'https://updated-example.com',
    required: false
  })
  @IsString()
  @IsOptional()
  link?: string;

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
