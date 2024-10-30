import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested } from "class-validator";
import { CreateBookmarkDto } from "src/bookmark/dto";

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
