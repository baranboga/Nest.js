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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';

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
  @ApiOperation({ summary: 'Create new bookmark' })
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(
      userId,
      dto,
    );
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
}
