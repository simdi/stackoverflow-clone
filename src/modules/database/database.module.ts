import { Module, Global } from '@nestjs/common';
import mongooseConnection from '../../db';
import { HelperService } from '../../shared/helpers/helper';

@Global()
@Module({
  imports: [
    mongooseConnection,
  ],
  providers: [HelperService],
  exports: [HelperService]
})
export class DatabaseModule {
}