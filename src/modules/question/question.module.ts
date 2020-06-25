import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionService } from '../../services/question/question.service';
import { QuestionController } from '../../controllers/question/question.controller';
import { QuestionSchema } from '../../models/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Question', schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: []
})
export class QuestionModule {}
