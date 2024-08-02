import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
    
  }

  @Get('questions/:id')
  getQuestionsByCategoryId(@Param('id', ParseIntPipe) id: number) {
    console.log(`Received id: ${id}`); // Log the received id for debugging
    if (!id) {
      throw new BadRequestException('categoryId is required');
    }
    return this.categoriesService.getQuestionsByCategoryId(id);
  }

  @Get('withQuestions')
  getCategoriesWithQuestions() {
    return this.categoriesService.getCategoriesWithQuestions();
  }

  @Get('historyQuestions')
  getCategoriesWithHistoryQuestions() {
    return this.categoriesService.getCategoriesWithHistoryQuestions();
  }

  @Post()
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.createCategory(body);
  }

  @Put(':id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: CreateCategoryDto) {
    return this.categoriesService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
