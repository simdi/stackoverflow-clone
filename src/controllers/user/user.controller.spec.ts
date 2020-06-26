import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { DatabaseModule } from '../../modules/database/database.module';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
