import {
  ForbiddenException,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AppGateway } from '../socket/app.gateway';


@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AppGateway))
    private gateway: AppGateway,
  ) {}

  async getCategories() {
    return await this.prisma.category.findMany({
      include:{
        questions:{
          include:{
            questionContents:true
          }
        }
      }
    });
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
        const newCategory = await this.prisma.category.create({
            data: dto,
        });

        const updatedCategories = await this.getCategories();
        this.gateway.server.emit('data', updatedCategories);

        return newCategory;
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            throw new ForbiddenException(e.message);
        }
        throw e;
    }
}

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        //Burada dto içindeki questions arrayini map ederek questionContents ile birlikte create ediyoruz.
        data: {
          ...dto,
          questions: {
            create: dto.questions.map((question) => ({
              ...question,
              questionContents: {
                create: question.questionContents,
              },
            })),
          },
        },
      });
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(e.message);
      }
      throw e;
    }
  }

  async deleteCategory(id: number) {
    try {
      // Kategoriyi sil
      await this.prisma.category.delete({
        where: {
          id,
        },
      });
  
      // Silme işleminden sonra güncellenmiş kategorileri al
      const updatedCategories = await this.getCategories();
  
      // Bağlantılı istemcilere veri gönder
      this.gateway.server.emit('data', updatedCategories);
  
      // Silinen kategoriyi döndür
      return updatedCategories; // Bu kısımda updatedCategories döndürülebilir veya başka bir şey
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(e.message);
      }
      throw e;
    }
  }}
