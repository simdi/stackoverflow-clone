import { MongooseModule } from '@nestjs/mongoose';
import config from './config';

console.log('Env', config.get('env'))
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

export default (async() => {
  return await MongooseModule.forRoot(url, mongoDBOptions);
})();