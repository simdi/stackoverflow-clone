import { MongooseModule } from '@nestjs/mongoose';
import config from './config';

const { host, database, port } = config.get('mongo');
const url = `mongodb://${host}:${port}/${database}`;

export const passportModuleOptions = { defaultStrategy: 'jwt' };

export const jwtModuleOptions = {
  secret: config.get('jwt.secret'),
  signOptions: { expiresIn: config.get('jwt.expires') },
};

export default (async() => {
  return await MongooseModule.forRoot(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
})();