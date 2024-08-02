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
      return await this.prisma.question.findMany();
    }
      
    async createQuestion(dto: CreateQuestionDto) {
      try {
        return await this.prisma.question.create({
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

    async updateQuestion(id: number, dto: CreateQuestionDto) {
      try {
      if (dto.title=="deneme") {
        throw new ForbiddenException("Title cannot be deneme");
      }
      else {

        return await this.prisma.question.update({
          where: {
            id: id,
          },
          data: {
            ...dto,
          },
        });
      }
    } catch (e) {
      throw e;
    }}

   async deleteQuestion(id: number) {
     return await this.prisma.question.delete({
       where: {
         id: id,
       },
     });
   }
   


  }


  