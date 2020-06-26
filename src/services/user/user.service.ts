import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { IUser } from '../../models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from '../../dto/user.dto';
import { HelperService } from '../../shared/helpers/helper';
import { AuthService } from '../auth/auth.service';
import { CreatedDTO, LoginResponseDTO } from 'src/dto/responses/created.dto';

export enum USER_TYPE {
  regular = 'REGULAR',
  admin = 'ADMIN'
};

@Injectable()
export class UserService {
  static USER_TYPE = USER_TYPE;

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
  ) {}

  async create(user: UserDTO, action = 'user'): Promise<CreatedDTO | LoginResponseDTO> {
    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();

      if (!savedUser) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      if (action !== 'user') {
        // Log the user in.
        const { email, password } = user;
        return await this.authService.validateUser({ email, password });
      }
      return { id: savedUser._id };
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async findAll(query: { page: string, limit: string }): Promise<any> {
    return await this.userModel.paginate({}, {
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' }
    });
  }

  async findById(id: string): Promise<IUser> {
    try {
      const findById = await this.userModel.findById(id);
      if (!findById) {
        throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
      }
      return findById;
    } catch (error) {
      await this.helperService.catchValidationError(error);
    }
  }

  async findOne(email: string): Promise<IUser> {
    try {
      const findById = await this.userModel.findOne({ email }).select({ password: 1, email: 1, role: 1 });
      if (!findById) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }
      return findById;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
