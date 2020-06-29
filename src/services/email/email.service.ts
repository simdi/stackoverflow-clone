import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(to: string, question: string, answer: string): void {
    this.mailerService.sendMail({
      to, // list of receivers
      from: 'noreply@stackoverflowclone.com', // sender address
      subject: 'Someone answered your question ✔', // Subject line
      html: `
        <div>
          <b>Question: ${question}</b>
          <br/>
          <p>Someone said:</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;${answer}</p>
        </div>
      `, // HTML body content
    }).then((res) => {
      console.log('Mail sent');
    }).catch((err) => {
      console.log('Mail Err', err)
    });
  }
}