import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../../config';
import { HelperService } from '../../shared/helpers/helper';

const { host, database, port } = config.get('mongo');
export const url = `mongodb://${host}:${port}/${database}`;

export const passportModuleOptions = { defaultStrategy: 'jwt' };

export const jwtModuleOptions = {
  secret: config.get('jwt.secret'),
  signOptions: { expiresIn: config.get('jwt.expires') },
};

export const mongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

@Module({
  imports: [
    MongooseModule.forRoot(url, mongoDBOptions),
  ],
  providers: [HelperService],
  exports: [HelperService]
})
export class DatabaseModule {
}