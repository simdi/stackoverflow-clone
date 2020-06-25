import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { UserDTO } from '../../dto/user.dto';
import { LoginDTO } from '../../dto/login.dto';
import { LoginResponseDTO } from '../../dto/responses/created.dto';
import { ErrorDTO } from '../../dto/responses/error.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
    type: LoginResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  async login(@Body() login: LoginDTO): Promise<any> {
    return this.authService.validateUser(login);
  }
 
  @Post('/register')
  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
    type: LoginResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  async register(@Body() user: UserDTO): Promise<any> {
    return this.userService.create(user, 'register');
  }
}
