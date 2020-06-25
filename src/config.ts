import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import * as convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test', 'acceptance'],
    default: 'development',
    env: 'NODE_ENV'
  },
  apiPrefix: {
    doc: 'The application prefix',
    format: String,
    default: '/api/v1'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: String,
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  mongo: {
    host: {
      doc: 'Database host name',
      format: '*',
      default: 'localhost',
      env: 'MONGO_HOST',
    },
    database: {
      doc: 'Database name',
      format: String,
      default: 'stackoverflow-clone'
    }
  },
  jwt: {
    secret: {
      doc: 'JWT Secret',
      format: String,
      env: 'JWT_SECRET',
      default: process.env.JWT_SECRET,
      sensitive: true
    },
    expires: {
      doc: 'JWT Expiry',
      format: Number,
      env: 'JWT_EXPIRES'
    }
  },
});

const configFiles = [path.resolve(__dirname, `../config/${config.get('env')}.json`)];
config.loadFile(configFiles);

export default config;
