import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { DatabaseModule } from '../../modules/database/database.module';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { IUser } from '../../models/user.schema';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    const query = { page: '1', limit: '10' };
    const searchQuery = { ...query, name: 'john' };

    describe('findAll', () => {
      it('should return a paginated docs of users', async () => {
        const spy = await jest.spyOn(service, 'findAll').mockImplementation(async() => findAllResult);
  
        expect(await service.findAll(query)).toBe(findAllResult);
        expect((await service.findAll(query)).docs.length).toBe(findAllResult.docs.length);
        expect((await service.findAll(query)).totalDocs).toEqual(findAllResult.docs.length);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(3);
      });
    });
    
    describe('searchAll', () => {
      it('should return a paginated docs of searched user or answer', async () => {
        const spy = await jest.spyOn(service, 'searchAll').mockImplementation(async() => findAllResult);
  
        expect(await service.searchAll(searchQuery)).toBe(findAllResult);
        expect((await service.searchAll(searchQuery)).docs.length).toBe(findAllResult.docs.length);
        expect((await service.searchAll(searchQuery)).totalDocs).toEqual(findAllResult.docs.length);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(3);
      });
    });
    
    describe('findById', () => {
      it('should return a user', async () => {
        const userId = '5ef739087eaf94b2eacc1f29';
        const spy = await jest.spyOn(service, 'findById').mockImplementation(async() => result);
  
        expect(await service.findById(userId)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'findById').mockImplementation(async() => badRequest);
        expect(await service.findById(undefined)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
    
    describe('create', () => {
      it('should return a user', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(async () => result);
  
        expect(await service.create(payload)).toBe(result);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
      it('should return 400 Bad Request', async () => {
        const spy = await jest.spyOn(service, 'create').mockImplementation(async () => badRequest);

        expect(await service.create(payload)).toBe(badRequest);
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
      });
    });
  });

});
