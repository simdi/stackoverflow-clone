import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { DatabaseModule } from '../../modules/database/database.module';
import { IUser } from '../../models/user.schema';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { UserService } from '../../services/user/user.service';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule],
    }).compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Users unit test', () => {
    const result: IUser | any = {
      "role": "REGULAR",
      "_id": "5ef739087eaf94b2eacc1f29",
      "email": "email1@yahoo.com",
      "firstName": "string",
      "lastName": "int",
      "uuid": "37361c63-e5c1-4ab0-a67c-a67a57da4bf8"
    };
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
      "email": "yahoo@yahoo.com",
      "password": "string",
      "firstName": "John",
      "lastName": "Doe"
    };
    const badRequest: ErrorDTO | any = {
      "status": 400,
      "timestamp": "Sun, 28 Jun 2020 00:32:28 GMT",
      "path": "/api/v1/users/5ef76a682c2972c07c3693a",
      "method": "GET",
      "message": "Invalid Id supplied"
    };
    const query = { page: 1, limit: 10 };
    const searchQuery = { ...query, name: 'john' };

    describe('findAll', () => {
      it('should return a paginated docs of users', async () => {
        const spy = await jest.spyOn(service, 'findAll').mockImplementation(async() => findAllResult);
  
        expect(await controller.findAll(query)).toBe(findAllResult);
        expect((await controller.findAll(query)).docs.length).toBe(findAllResult.docs.length);
        expect((await controller.findAll(query)).totalDocs).toEqual(findAllResult.docs.length);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(3);
      });
    });
    
    describe('searchAll', () => {
      it('should return a paginated docs of searched user or answer', async () => {
        const spy = await jest.spyOn(service, 'searchAll').mockImplementation(async() => findAllResult);
  
        expect(await controller.searchAll(searchQuery)).toBe(findAllResult);
        expect((await controller.searchAll(searchQuery)).docs.length).toBe(findAllResult.docs.length);
        expect((await controller.searchAll(searchQuery)).totalDocs).toEqual(findAllResult.docs.length);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(3);
      });
    });
    
    describe('findById', () => {
      it('should return a user', async () => {
        const userId = '5ef739087eaf94b2eacc1f29';
        const spy = await jest.spyOn(service, 'findById').mockImplementation(async() => result);
  
        expect(await controller.findById(userId)).toBe(result);
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
    
    describe('create', () => {
      it('should return a user', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(async () => result);
  
        expect(await controller.create(payload)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(async () => badRequest);

        expect(await controller.create(payload)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
  });

});
