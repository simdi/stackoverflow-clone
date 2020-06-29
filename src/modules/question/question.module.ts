import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionService } from '../../services/question/question.service';
import { QuestionController } from '../../controllers/question/question.controller';
import { QuestionSchema } from '../../models/question.schema';
import { VoteSchema } from '../../models/vote.schema';
import { EmailService } from '../../services/email/email.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Question', schema: QuestionSchema },
      { name: 'Vote', schema: VoteSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService, EmailService],
  exports: []
})
export class QuestionModule {}
