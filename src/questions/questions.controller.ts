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
  import { QuestionService } from './questions.service';
  import { CreateQuestionDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteQuestionDto } from './dto';
  
  @ApiTags('question')
  @Controller('question')
  export class QuestionController {
    constructor(private QuestionService: QuestionService) {}

    @Get()
    getQuestions() {
      return this.QuestionService.getQuestions();
    }

    @Post()
    createQuestion(@Body() body: CreateQuestionDto) {
      return this.QuestionService.createQuestion(body);
    }

    @Put(':id')
    updateQuestion(@Param('id', ParseIntPipe) id: number, @Body() body: CreateQuestionDto) {
      return this.QuestionService.updateQuestion(id, body);
    }

    @Delete(':id')
    async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
      return this.QuestionService.deleteQuestion(id);
    }




  }
  
  
  
  