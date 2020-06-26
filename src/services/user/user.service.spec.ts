import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { DatabaseModule } from '../../modules/database/database.module';

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
});
