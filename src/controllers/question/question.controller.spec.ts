import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { QuestionController } from './question.controller';
import { QuestionService } from '../../services/question/question.service';
import { IQuestion, QuestionSchema } from '../../models/question.schema';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { VoteSchema } from '../../models/vote.schema';
import { HelperService } from '../../shared/helpers/helper';
import { EmailService } from '../../services/email/email.service';
import { UserService } from '../../services/user/user.service';
import { UserSchema } from '../../models/user.schema';
import { AuthService } from '../../services/auth/auth.service';

describe('Question Controller', () => {
  let controller: QuestionController;
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        QuestionService,
        HelperService,
        UserService,
        AuthService,
        {
          provide: EmailService,
          useValue: MailerModule
        },
        {
          provide: JwtService,
          useClass: JwtModule,
        },
        {
          provide: getModelToken('User'),
          useValue: UserSchema
        },
        {
          provide: getModelToken('Question'),
          useValue: QuestionSchema
        },
        {
          provide: getModelToken('Vote'),
          useValue: VoteSchema
        },
      ]
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Questions unit test', () => {
    const result: IQuestion | any = {
      "vote": 0,
      "_id": "5ef76a682c2972c07c3693a7",
      "title": "int",
      "body": "string",
      "userId": "5ef638101dc49f82a6f7c666",
      "user": {
        "role": "REGULAR",
        "_id": "5ef638101dc49f82a6f7c666",
        "email": "email@yahoo.com",
        "firstName": "John",
        "lastName": "Doe",
        "uuid": "76ab79dd-8ccd-41dc-9433-a8af4e7eb1ba",
        "__v": 0
      },
      "answers": [
        {
          "_id": "5ef76a752c2972c07c3693a8",
          "userId": "5ef638101dc49f82a6f7c666",
          "body": "collection",
          "user": {
            "role": "REGULAR",
            "_id": "5ef638101dc49f82a6f7c666",
            "email": "email@yahoo.com",
            "firstName": "John",
            "lastName": "Doe",
            "uuid": "76ab79dd-8ccd-41dc-9433-a8af4e7eb1ba",
            "__v": 0
          }
        },
        {
          "_id": "5ef76b593b787cc0ed87ceec",
          "userId": "5ef638101dc49f82a6f7c666",
          "body": "string",
          "user": {
            "role": "REGULAR",
            "_id": "5ef638101dc49f82a6f7c666",
            "email": "email@yahoo.com",
            "firstName": "John",
            "lastName": "Doe",
            "uuid": "76ab79dd-8ccd-41dc-9433-a8af4e7eb1ba",
            "__v": 0
          }
        }
      ],
      "uuid": "f2d7f699-63c0-4393-8910-6695ef2303f5"
    }
    const findAllResult = {
      "docs": [result],
      "totalDocs": 1,
      "limit": 10,
      "totalPages": 1,
      "page": 1,
      "pagingCounter": 1,
      "hasPrevPage": false,
      "hasNextPage": false,
      "prevPage": null,
      "nextPage": null
    };
    const payload = {
      title: "Calculate distance between two latitude-longitude points? (Haversine formula)",
      subscribeToAnswer: false,
      body: "How do I calculate the distance between two points specified by latitude and longitude? \n For clarification, I'd like the distance in kilometers; the points use the WGS84 system and I'd like to understand the relative accuracies of the approaches available."
    };
    const badRequest: ErrorDTO | any = {
      "status": 400,
      "timestamp": "Sun, 28 Jun 2020 00:32:28 GMT",
      "path": "/api/v1/questions/5ef76a682c2972c07c3693a",
      "method": "GET",
      "message": "Invalid Id supplied"
    };
    const req = {
      user: {
        "userId": "5ef638101dc49f82a6f7c666",
        "role": "REGULAR",
        "email": "email@yahoo.com",
        "iat": 1593302727,
        "exp": 1593389127
      }
    };
    const answer = { body: "This link might be helpful to you, as it details the use of the Haversine formula to calculate the distance.\n```Excerpt: This script [in Javascript] calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the ‘Haversine’ formula.```" };
    const query = { page: 1, limit: 10 };
    const searchQuery = { ...query, text: 'unknown' };

    describe('findAll', () => {
      it('should return a paginated docs of questions', async () => {
        const spy = await jest.spyOn(service, 'findAll').mockImplementation(async() => findAllResult);
  
        expect(await controller.findAll(query)).toBe(findAllResult);
        expect((await controller.findAll(query)).docs.length).toBe(findAllResult.docs.length);
        expect((await controller.findAll(query)).totalDocs).toEqual(findAllResult.docs.length);
        expect((await controller.findAll(query)).docs[0].answers.length).toEqual(findAllResult.docs[0].answers.length);
        expect((await controller.findAll(query)).docs[0].vote).toEqual(findAllResult.docs[0].vote);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(5);
      });
    });
    
    describe('searchAll', () => {
      it('should return a paginated docs of searched question or answer', async () => {
        const spy = await jest.spyOn(service, 'searchAll').mockImplementation(async() => findAllResult);
  
        expect(await controller.searchAll(searchQuery)).toBe(findAllResult);
        expect((await controller.searchAll(searchQuery)).docs.length).toBe(findAllResult.docs.length);
        expect((await controller.searchAll(searchQuery)).totalDocs).toEqual(findAllResult.docs.length);
        expect((await controller.searchAll(searchQuery)).docs[0].answers.length).toEqual(findAllResult.docs[0].answers.length);
        expect((await controller.searchAll(searchQuery)).docs[0].vote).toEqual(findAllResult.docs[0].vote);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(5);
      });
    });
    
    describe('findById', () => {
      it('should return a question', async () => {
        const questionId = '5ef76a682c2972c07c3693a7';
        const spy = await jest.spyOn(service, 'findById').mockImplementation(async() => result);
  
        expect(await controller.findById(questionId)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'findById').mockImplementation(async() => badRequest);
        expect(await controller.findById(undefined)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
  
    describe('answerQuestionById', () => {
      it('should return a question', async () => {
        const spy = await jest.spyOn(service, 'answerQuestionById').mockImplementation(async () => result);
  
        expect(await controller.answerQuestionById(payload, answer, req)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'answerQuestionById').mockImplementation(async () => badRequest);

        expect(await controller.answerQuestionById(payload, answer, req)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
    
    describe('create', () => {
      it('should return a question', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(() => result);
  
        expect(await controller.create(payload, req)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(() => badRequest);

        expect(await controller.create(payload, req)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
  });
});
