import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import config from '../../config';

@Injectable()
export class HelperService {
  static SALT = 10;
  static APP_PREFIX = config.get('apiPrefix');

  async catchValidationError(error: any): Promise<never> {
    if (error.name === 'MongoError') {
      const errMsg = await this.getMsgFromMongoError(error.errmsg);
      throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
    } else if (error.name === 'ValidationError') {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    throw new HttpException(error, error.status);
  }

  async getMsgFromMongoError(error: string): Promise<string> {
    if (error.length > 0) {
      const errMsg = error.split(':').slice(2).join('').trim();
      return errMsg;
    }
    return error; 
  }
}
