import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../../controllers/user/user.controller';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserSchema } from '../../models/user.schema';
import { JwtStrategy } from '../../services/auth/jwt.service';
import { passportModuleOptions, jwtModuleOptions } from '../../db';
import { AuthController } from '../../controllers/auth/auth.controller';
import { HelperService } from '../../shared/helpers/helper';

@Module({
  imports: [
    PassportModule.register(passportModuleOptions),
    JwtModule.register(jwtModuleOptions),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, JwtStrategy, HelperService],
  exports: [UserService, AuthService, JwtStrategy, HelperService]
})
export class AuthModule {}
