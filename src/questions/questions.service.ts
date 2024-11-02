import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { CreateQuestionDto } from './dto';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
  import { DeleteQuestionDto } from './dto/delete-question.dto';

  
  @Injectable()
  export class QuestionService {
    constructor(
      private prisma: PrismaService,
      
    ) {}

    async getQuestions() {
      return await this.prisma.question.findMany({include:{questionContents:true}} as any);
    }

    async getQuestionByCategoryIdRandom(id: number) {
      const questions = await this.prisma.question.findMany({
        where: {
          categoryId: id,
        },
      });
    
      // Eğer hiç soru yoksa, boş döndür
      if (questions.length === 0) {
        return null;
      }
    
      // Rastgele bir soru seçin
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    }
      
    async createQuestion(dto: CreateQuestionDto) {
      try {
        return await this.prisma.question.create({
          data: {
            categoryId: dto.categoryId,
            ...dto,
            questionContents: {
              create: dto.questionContents.map((content) => ({
                content: content.content,
                isCorrect: content.isCorrect,
                
              } )),
            },
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          throw new ForbiddenException(e.message);
        }
        throw e;
      }
    }

    async updateQuestion(id: number, dto: CreateQuestionDto) {
      try {
        if (dto.title === "deneme") {
          throw new ForbiddenException("Title cannot be deneme");
        }

        // Önce content kontrolü yapalım gerekirse foreach ile veriyi düzenleyelim
        //Direk dto da düzenleme yapılabilir
        //map ise veri atamak ya da düzenlemek için kullanılır ve yeni bir array oluşturur
        dto.questionContents.forEach(content => {
          if (content.content === "deneme") {
            content.content="deneme2";
          }
        });
        // Sonra update işlemini yapalım
        return await this.prisma.question.update({
          where: {
            id: id,
          },
          data: {
            ...dto,
            questionContents: {
              deleteMany: {}, // Önce mevcut içerikleri sil
              create: dto.questionContents.map((content) => ({
                content: content.content,
                isCorrect: content.isCorrect,
              })),
            },
            
          },
          include:{questionContents:true}
        });
      } catch (e) {
        throw e;
      }
    }

   async deleteQuestion(id: number) {
     return await this.prisma.question.delete({
       where: {
         id: id,
       },
     });
   }
   


  }


  