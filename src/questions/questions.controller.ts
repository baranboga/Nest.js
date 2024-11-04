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
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteQuestionDto } from './dto/delete-question.dto';
import { UpdateQuestionContentDto } from './dto/update-questionContent.dto';
import { CreateQuestionContentDto } from './dto/create-questionContent.dto';
  
  @ApiTags('question')
  @Controller('question')
  export class QuestionController {
    constructor(private QuestionService: QuestionService) {}

    @Get()
    getQuestions() {
      return this.QuestionService.getQuestions();
    }

    @Get('getQuestionByCategoryIdRandom/:CategoryId')
    getQuestionByCategoryIdRandom(@Param('CategoryId', ParseIntPipe) id: number) {
      return this.QuestionService.getQuestionByCategoryIdRandom(id);
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

    @Get('getQuestionContent')
    getQuestionContent() {
      return this.QuestionService.getQuestionContent();
    }

    @Post("createQuesitonContent")
    createQuestionContent(@Body() body:CreateQuestionContentDto){
      return this.QuestionService.createQuestionContent(body);
    }


    @Put('updateQuestionContent/:id')
    updateQuestionContent(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateQuestionContentDto) {
      return this.QuestionService.updateQuestionContent(id, body);
    }

    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          questionId: { type: 'number' },
        },
      },
    })
    @Post("assignQuestionContentToQuestion/:questionContentId")
    assignQuestionContentToQuestion(@Param('questionContentId', ParseIntPipe) questionContentId: number, @Body("questionId",ParseIntPipe) questionId: number) {
      return this.QuestionService.assingQuestionContentToQuestion(questionContentId, questionId);
    }




  }
  
  
  
  