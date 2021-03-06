import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;
  @ApiProperty({
    type: Boolean,
    example: false
  })
  @IsString()
  subscribeToAnswer: boolean;
  @ApiProperty({
    type: String,
  })
  @IsString()
  body: string;
};
export class AnswerQuestionDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  body: string;
};
