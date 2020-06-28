import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, HttpCode, Post, Body, Param, Get, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { IUser } from '../../models/user.schema';
import { UserDTO } from '../../dto/user.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AuthGuard } from '../../shared/guards/authorization.guard';
import { CreatedDTO, LoginResponseDTO } from '../../dto/responses/created.dto';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { FindDTO } from '../../dto/responses/find.dto';

@ApiBearerAuth('access_token')
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found records',
    type: [UserDTO],
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async findAll(@Query() query): Promise<FindDTO> {
    return await this.userService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search Users' })
  @ApiQuery({ name: 'name', required: true, example: 'john doe' })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found records',
    type: FindDTO,
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async searchAll(@Query() query): Promise<FindDTO> {
    return await this.userService.searchAll(query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a single User' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found record',
    type: UserDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Not Found',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async findById(@Param('userId') id): Promise<IUser> {
    return await this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: CreatedDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async create(@Body() user: UserDTO): Promise<CreatedDTO | LoginResponseDTO> {
    return await this.userService.create(user);
  }
}

