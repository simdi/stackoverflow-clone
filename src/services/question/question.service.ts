import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IQuestion } from '../../models/question.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionDTO } from '../../dto/question.dto';
import { HelperService } from '../../shared/helpers/helper';
import { CreatedDTO } from '../../dto/responses/created.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<IQuestion>,
    private readonly helperService: HelperService,
  ) {}

  async create(question: QuestionDTO): Promise<CreatedDTO> {
    try {
        const newQuestion = new this.questionModel(question);
        const savedQuestion = await newQuestion.save();
        return { id: savedQuestion._id };
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async findAll(): Promise<IQuestion[]> {
    return await this.questionModel.find();
  }

  async findById(id: string): Promise<IQuestion> {
    try {
      const findById = await this.questionModel.findById(id);
      if (!findById) {
        throw new HttpException('Invalid question id', HttpStatus.BAD_REQUEST);
      }
      return findById;
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }
}
