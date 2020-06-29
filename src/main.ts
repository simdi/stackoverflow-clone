import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from './config';

export const PORT: string | number = config.get('port') || 3000;
export const urlPrefix: string = config.get('apiPrefix');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix(urlPrefix);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Stackoverflow Clone API')
    .setDescription('Stackoverflow Clone API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access_token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${urlPrefix}/docs`, app, document);

  await app.listen(PORT);
}
bootstrap();
