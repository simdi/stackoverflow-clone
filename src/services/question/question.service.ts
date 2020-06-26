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

  async create(question: QuestionDTO, user: any): Promise<CreatedDTO> {
    try {
      const addUserIdToQuestion = { ...question, userId: user.userId };
      const newQuestion = new this.questionModel(addUserIdToQuestion);
      const savedQuestion = await newQuestion.save();
      return { id: savedQuestion._id };
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async findAll(query: { page: string, limit: string }): Promise<any> {
    return await this.questionModel.paginate({}, {
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' }
    });
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
  
  async voteById(param: { questionId: string, voteType: number }): Promise<any> {
    const { questionId, voteType } = param;

    try {
      const updateOne = await this.questionModel.updateOne(
        { _id: questionId },
        { $inc: { vote: voteType == 1 ? -1 : 1 }}
      );
      // @Todo
      // Create a record in the votes collection to indicate that a user has voted
      if (!updateOne) {
        throw new HttpException('Invalid question id', HttpStatus.BAD_REQUEST);
      }
      return { success: true };
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }
}
