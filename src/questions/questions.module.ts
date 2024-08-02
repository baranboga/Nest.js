import { Module } from '@nestjs/common';
import { QuestionController } from './questions.controller';
import { QuestionService } from './questions.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionsModule {}
