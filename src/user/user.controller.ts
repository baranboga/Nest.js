import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UploadedFiles,
  UseInterceptors,

} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FilesUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  //Burada GetUser decorator'ı kullanılarak kullanıcının bilgileri alınıyor. bunu guarddan dönen request'den de alıyoruz.
  //Getuser dekaratörü jwt strategy den dönen user bilgisini alıyor.

// @Get('me')
// getMe(@Req() req: Request) {
//   // JWT strategy'den gelen user bilgisi request objesinde saklanır
//   const user = req.user;
//   return user;
// }
  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Edit user profile' })
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @ApiOperation({ summary: 'Update a user with bookmarks and files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            email: { 
              type: 'string', 
              example: 'updated@example.com',
              description: 'Updated email address'
            },
            firstName: { 
              type: 'string', 
              example: 'John Updated',
              description: 'Updated first name'
            },
            lastName: { 
              type: 'string', 
              example: 'Doe Updated',
              description: 'Updated last name'
            },
            bookmarks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Updated Bookmark' },
                  description: { type: 'string', example: 'Updated Description' },
                  link: { type: 'string', example: 'https://updated-example.com' },
                },
              },
            },
          },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files for bookmarks (one file per bookmark)',
        },
      },
      required: ['data']
    },
  })
  @Put(':id')
  @UseInterceptors(FilesUploadInterceptor('files'))
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body('data') dto: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const parsedDto = JSON.parse(dto);
    return this.userService.updateUser(userId, parsedDto, files);
  }

  @ApiOperation({ summary: 'Create a new user with bookmarks' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            email: { 
              type: 'string', 
              example: 'user@example.com',
              description: 'Email address of the user'
            },
            password: { 
              type: 'string', 
              example: 'password123',
              description: 'Password for the account'
            },
            firstName: { 
              type: 'string', 
              example: 'John',
              description: 'First name of the user'
            },
            lastName: { 
              type: 'string', 
              example: 'Doe',
              description: 'Last name of the user'
            },
            bookmarks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'My Bookmark' },
                  description: { type: 'string', example: 'Description' },
                  link: { type: 'string', example: 'https://example.com' },
                },
              },
            },
          },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files for bookmarks (one file per bookmark)',
        },
      },
      required: ['data']
    },
  })
  @Post()
  @UseInterceptors(FilesUploadInterceptor('files'))
  createUser(
    //Burada ilk olarak multipart/form-data formatında gelen veriyi string'e çeviriyoruz.
    //Sonra bu dto yu parse ediyoruz ve createUser fonksiyonuna gönderiyoruz.
    @Body('data') dto: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log('Files:', files);
    const parsedDto = JSON.parse(dto);
    return this.userService.createUser(parsedDto, files);
  }
}
