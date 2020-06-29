import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './modules/question/question.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { EmailService } from './services/email/email.service';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    QuestionModule,
    DatabaseModule,
    AuthModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
