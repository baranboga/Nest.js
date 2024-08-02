import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getCategories() {
    return await this.prisma.category.findMany();
  }

  //include bizim için ilişkili tabloları getirmemizi sağlar
  async getCategoriesWithQuestions() {
    return await this.prisma.category.findMany({
      include: {
        questions: true,
      },
    });
  }


  async getCategoriesWithHistoryQuestions() {
    const Categories= await this.prisma.category.findMany({
      include: {
        questions: true,
      },
    });
    console.log(Categories);
    const historyCategory = Categories.filter((category) => category.name === 'History');
    if (historyCategory) {
      console.log(historyCategory);
       return historyCategory;
    }
    else{
      throw new ForbiddenException('History category not found');
    }
  }

  async getQuestionsByCategoryId(categoryId: number) {
    return await this.prisma.question.findMany({
      where: {
        categoryId,
      },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          ...dto,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(e.message);
      }
      throw e;
    }
  }

  async updateCategory(id: number, dto: CreateCategoryDto) {
    
  
  }

  async deleteCategory(id: number) {
   try {
      return await this.prisma.category.delete({
        where: {
          id,
        },
      });
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(e.message);
      }
      throw e;
    }
    
}}
