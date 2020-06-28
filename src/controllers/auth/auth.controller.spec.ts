import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { HelperService } from '../../shared/helpers/helper';
import { UserSchema } from '../../models/user.schema';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        AuthService,
        HelperService,
        {
          provide: JwtService,
          useClass: JwtModule,
        },
        {
          provide: getModelToken('User'),
          useValue: UserSchema,
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
