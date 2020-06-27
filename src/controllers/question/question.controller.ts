import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, HttpCode, Post, Body, Request, Param, Get, UseGuards, HttpStatus, Put, Query, Patch } from '@nestjs/common';
import { QuestionService } from '../../services/question/question.service';
import { IQuestion } from '../../models/question.schema';
import { QuestionDTO, AnswerQuestionDTO } from '../../dto/question.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AuthGuard } from '../../shared/guards/authorization.guard';
import { CreatedDTO } from '../../dto/responses/created.dto';
import { ErrorDTO } from '../../dto/responses/error.dto';
import { QuestionVoteDTO } from '../../dto/responses/updated.dto';
import { FindDTO } from '../../dto/responses/find.dto';

@ApiBearerAuth('access_token')
@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Questions' })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found records',
    type: FindDTO,
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async findAll(@Query() query): Promise<FindDTO> {
    return await this.questionService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search Questions' })
  @ApiQuery({ name: 'text', required: true, example: 'search text' })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found records',
    type: FindDTO,
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async searchAll(@Query() query): Promise<FindDTO> {
    return await this.questionService.searchAll(query);
  }

  @Get(':questionId')
  @ApiOperation({ summary: 'Get a single Question' })
  @ApiParam({ name: 'questionId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found record',
    type: QuestionDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Question Not Found',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async findById(@Param('questionId') id): Promise<IQuestion> {
    return await this.questionService.findById(id);
  }
  
  @Patch(':questionId/vote/:voteType')
  @ApiOperation({ summary: 'Vote for a Question' })
  @ApiParam({ name: 'questionId', type: String })
  @ApiParam({ name: 'voteType', example: 1, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found record',
    type: QuestionVoteDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Question Not Found',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async voteById(@Param() param, @Request() req): Promise<QuestionVoteDTO> {
    const { user } = req;
    return await this.questionService.voteById(param, user);
  }
  
  @Post(':questionId/answer')
  @ApiOperation({ summary: 'Submit answer to a Question' })
  @ApiParam({ name: 'questionId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The created response',
    type: CreatedDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Question Not Found',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async answerQuestionById(@Body() answer: AnswerQuestionDTO, @Param() param, @Request() req): Promise<CreatedDTO> {
    const { user } = req;
    return await this.questionService.answerQuestionById(param, answer, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Question' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Question created successfully',
    type: CreatedDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorDTO
  })
  @UseGuards(JwtAuthGuard, AuthGuard)
  async create(@Body() question: QuestionDTO, @Request() req): Promise<CreatedDTO> {
    const { user } = req;
    return await this.questionService.create(question, user);
  }
}

