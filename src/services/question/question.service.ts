import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IQuestion } from '../../models/question.schema';
import { QuestionDTO } from '../../dto/question.dto';
import { HelperService } from '../../shared/helpers/helper';
import { CreatedDTO } from '../../dto/responses/created.dto';
import { IVote } from '../../models/vote.schema';
import { QuestionVoteDTO } from '../../dto/responses/updated.dto';
import { FindDTO } from '../../dto/responses/find.dto';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<IQuestion>,
    @InjectModel('Vote') private readonly voteModel: Model<IVote>,
    private readonly helperService: HelperService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
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

  async findAll(query: { page: string, limit: string }): Promise<FindDTO> {
    const { page, limit } = query;
    return await this.questionModel.paginate({}, {
      populate: [
        {
          path: 'user',
          model: 'User',
        },
        {
          path: 'answers.user',
          model: 'User'           
        }
      ],
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' }
    });
  }
  
  async searchAll(query: { text: string, page: string, limit: string }): Promise<FindDTO> {
    const { text, page, limit } = query;
    return await this.questionModel.paginate({
      $or: [
        { title: { $regex: text, $options: 'i' } },
        { body: { $regex: text, $options: 'i' } },
        { 'answers.body': { $regex: text, $options: 'i' } },
      ]
    }, {
      populate: [{
        path: 'userId',
        model: 'User',
      },{
        path: 'answers.userId',
        model: 'User'           
      }],
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' }
    });
  }

  async findById(id: string): Promise<IQuestion | ErrorDTO> {
    try {
      const findById = await this.questionModel.findById(id).populate('userId').populate('answers.userId');
      if (!findById) {
        throw new HttpException('Invalid question id', HttpStatus.BAD_REQUEST);
      }
      return findById;
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }
  
  async voteById(param: { questionId: string, voteType: string }, user): Promise<QuestionVoteDTO> {
    const { questionId, voteType } = param;
    const { userId } = user;
    const vote = (parseInt(voteType) === 1) ? -1 : 1;

    try {
      // Get vote to check if it has been created before.
      const findVoteByQuestionId = await this.voteModel.findOne({ questionId }).select({ votes: 1, questionId: 1 });

      if (findVoteByQuestionId) {
        // Get vote by user and check if the user has voted before.
        const findVoteByUserId = await this.voteModel.findOne({ questionId, "users.userId": userId }).select({ users: { $elemMatch: { userId } }});

        if (findVoteByUserId) {
          // Check the type of vote the user has
          if (findVoteByUserId.users.length > 0 && findVoteByUserId.users[0].vote !== vote) {
            const updateUserVote = this.voteModel.updateOne({
              questionId, "users.userId": userId },
              {
                $inc: { votes: vote * 2 },
                $set: { "users.$.vote": vote }
              }
            );
            const updateQuestion = this.questionModel.findByIdAndUpdate(questionId, { $inc: { vote: vote * 2 }});
            const allPromise = await Promise.all([updateUserVote, updateQuestion]);

            if (allPromise[0] && allPromise[1]) {
              return { success: true };
            } else {
              throw new HttpException('There was a problem updating vote', HttpStatus.BAD_REQUEST);
            }
          }
          // The user has the same vote, so don't do anything.
          return { success: true };
        } else {
          // User hasn't voted before.
          const updateUserVote = this.voteModel.updateOne({ questionId }, { $inc: { votes: vote }, $push: { users: { userId, vote } } });
          const updateQuestion = this.questionModel.findByIdAndUpdate(questionId, { $inc: { vote }});
          const allPromise = await Promise.all([updateUserVote, updateQuestion]);

          if (allPromise[0] && allPromise[1]) {
            return { success: true };
          } else {
            throw new HttpException('There was a problem updating vote', HttpStatus.BAD_REQUEST);
          }
        }
      } else {
        // Create vote by question
        const updateQuestion = this.questionModel.findByIdAndUpdate(questionId, { $inc: { vote }});
        const voteObj = { questionId, users: [{ userId: userId, vote }], votes: vote };
        const newVote = new this.voteModel(voteObj);
        const allPromise = await Promise.all([newVote.save(), updateQuestion]);
        if (allPromise[0] && allPromise[1]) {
          return { success: true };
        } else {
          throw new HttpException('There was a problem updating vote', HttpStatus.BAD_REQUEST);
        }
      }
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async answerQuestionById(param: { questionId: string }, answer: { body: string }, user: any): Promise<CreatedDTO> {
    const { questionId } = param;
    const { userId } = user;
    const { body } = answer;

    try {
      // Get question by Id
      const createAnswerByQuestionId = await this.questionModel.findByIdAndUpdate(questionId, {
        $push: { answers: { userId, body } }
      });
      const { subscribeToAnswer } = createAnswerByQuestionId;
      if(subscribeToAnswer) {
        await this.sendMailToSubscribedUser(createAnswerByQuestionId.userId, createAnswerByQuestionId.title, body);
      }

      if (createAnswerByQuestionId) {
        return { id: createAnswerByQuestionId._id };
      } else {
        throw new HttpException('Invalid question id', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async sendMailToSubscribedUser(questionUserId: string, questionTitle: string, answer: string): Promise<void> {
    // Get the user's email,
    const questionUser = await this.userService.findById(questionUserId);
    const { email } = questionUser;
    this.emailService.sendMail(email, questionTitle, answer);
  }

}
