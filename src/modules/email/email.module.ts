import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from '../../config';

const sendGridAPIKey = config.get('sendGrid.password');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://apikey:${sendGridAPIKey}@smtp.sendgrid.net`,
      defaults: {
        from:'Stack Overflow Clone',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ]
})
export class EmailModule {}
