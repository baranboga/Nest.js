import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import { FileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}

  // @GetUser() dekoratörü, createParamDecorator kullanılarak oluşturulmuştur. Bu dekoratör, data adlı bir parametre alır (bu durumda 'id').
  // Daha sonra alınan bu veri userId ye atanır, @param gibi.
  @ApiOperation({ summary: 'Get all bookmarks for current user' })
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(
      userId,
    );
  }

  // @GetUser() dekoratörü, createParamDecorator kullanılarak oluşturulmuştur. Bu dekoratör, data adlı bir parametre alır (bu durumda 'id').
  // Daha sonra alınan bu veri userId ye atanır, @param gibi.
  @ApiOperation({ summary: 'Get bookmark by id' })
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
  }

  // @GetUser() dekoratörü, createParamDecorator kullanılarak oluşturulmuştur. Bu dekoratör, data adlı bir parametre alır (bu durumda 'id').
  // Daha sonra alınan bu veri userId ye atanır, @param gibi.
  @ApiOperation({ summary: 'Create new bookmark with file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            title: { 
              type: 'string', 
              example: 'My Bookmark',
              description: 'Title of the bookmark'
            },
            description: { 
              type: 'string', 
              example: 'Description of my bookmark',
              description: 'Description of the bookmark'
            },
            link: { 
              type: 'string', 
              example: 'https://example.com',
              description: 'URL of the bookmark'
            },
          },
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Select a file to upload (JPEG, PNG or PDF)',
        },
      },
      required: ['data']
    },
  })
  @Post()
  @UseInterceptors(FileUploadInterceptor())
  createBookmark(
    @GetUser('id') userId: number,
    @Body('data') dto: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const parsedDto = JSON.parse(dto);
    return this.bookmarkService.createBookmark(userId, parsedDto, file);
  }

  // Update bookmark by id with file
  @ApiOperation({ summary: 'Update bookmark by id with file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'My Bookmark' },
        description: { type: 'string', example: 'Description of my bookmark' },
        link: { type: 'string', example: 'https://example.com' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (jpeg, png, pdf only)',
        },
      },
      required: ['title', 'link']
    },
  })
  @Put(':id')
  @UseInterceptors(FileUploadInterceptor())
  updateBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.bookmarkService.updateBookmarkById(userId, bookmarkId, dto, file);
  }

  @ApiOperation({ summary: 'Edit bookmark by id' })
  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      dto,
    );
  }

  @ApiOperation({ summary: 'Delete bookmark by id' })
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      userId,
      bookmarkId,
    );
  }

  @ApiOperation({ summary: 'Assign bookmark to user' })
  @Post('assign/:id')
  assignBookmarkToUser(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.assignBookmarkToUser(userId, bookmarkId);
  }
}
