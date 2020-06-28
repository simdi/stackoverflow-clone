import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionModule } from '../../modules/question/question.module';
import { DatabaseModule } from '../../modules/database/database.module';
import { QuestionDTO } from '../../dto/question.dto';
import { IQuestion } from '../../models/question.schema';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { CreatedDTO } from 'src/dto/responses/created.dto';

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [QuestionModule, DatabaseModule],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Question service unit test', () => {
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
    const payload: QuestionDTO = {
      title: "Calculate distance between two latitude-longitude points? (Haversine formula)",
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
    const query = { page: '1', limit: '10' };
    const searchQuery = { ...query, text: 'unknown' };
    const created: CreatedDTO = { id: '5ef76a682c2972c07c3693a7' };

    describe('findAll', () => {
      it('Should findAll question', async () => {
        const spy = await jest.spyOn(service, 'findAll').mockImplementation(async() => findAllResult);
    
        expect(await service.findAll(query)).toBe(findAllResult);
        expect((await service.findAll(query)).docs.length).toBe(findAllResult.docs.length);
        expect((await service.findAll(query)).totalDocs).toEqual(findAllResult.docs.length);
        expect((await service.findAll(query)).docs[0].answers.length).toEqual(findAllResult.docs[0].answers.length);
        expect((await service.findAll(query)).docs[0].vote).toEqual(findAllResult.docs[0].vote);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(5);
      });
    });

    describe('searchAll', () => {
      it('Should searchAll question', async () => {
        const spy = await jest.spyOn(service, 'searchAll').mockImplementation(async() => findAllResult);
    
        expect(await service.searchAll(searchQuery)).toBe(findAllResult);
        expect((await service.searchAll(searchQuery)).docs.length).toBe(findAllResult.docs.length);
        expect((await service.searchAll(searchQuery)).totalDocs).toEqual(findAllResult.docs.length);
        expect((await service.searchAll(searchQuery)).docs[0].answers.length).toEqual(findAllResult.docs[0].answers.length);
        expect((await service.searchAll(searchQuery)).docs[0].vote).toEqual(findAllResult.docs[0].vote);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(5);
      });
    });
  
    describe('create', () => {
      it('Should create question', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(async() => created);
    
        expect(await service.create(payload, req.user)).toBe(created);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(payload, req.user);
      });
    });

    describe('findById', () => {
      it('Should findById question', async () => {
        const spy = await jest.spyOn(service, 'findById').mockImplementation(() => result);
        const id = '5ef76a682c2972c07c3693a7';
        expect(await service.findById(id)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(id);
      });
    });
  });

});
