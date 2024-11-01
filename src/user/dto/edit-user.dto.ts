import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateBookmarkDto } from 'src/bookmark/dto';

export class EditUserDto {
  @ApiProperty({
    description: 'Updated email address',
    example: 'updated@example.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Bookmarks of the user',
    type: [CreateBookmarkDto],
    example: [{ 
      title: 'Bookmark 1', 
      link: 'https://example.com', 
      description: 'This is a bookmark description' 
    }],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Her bir bookmark'ın doğrulanması gerekiyor
  @Type(() => CreateBookmarkDto) // CreateBookmarkDto'ya dönüştürme işlemi bu işlem gelen veriyi dönüştürmek için yapılıyor.
  bookmarks?: CreateBookmarkDto[];
}
