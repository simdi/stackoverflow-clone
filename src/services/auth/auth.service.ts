import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDTO } from '../../dto/login.dto';
import { LoginResponseDTO } from '../../dto/responses/created.dto';

@Injectable()
export class AuthService {

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: LoginDTO): Promise<any> {
    const { email, password } = login;
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return await this.generateToken(user);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(user: any): Promise<LoginResponseDTO> {
    const payload = await this.getTokenData(user);
    // eslint-disable-next-line @typescript-eslint/camelcase
    return { access_token: this.jwtService.sign(payload) };
  }

  async getTokenData(user: any): Promise<any> {
    const { email, role } = user;

    return {
      sub: user._id,
      role,
      email,
    };
  }
}
