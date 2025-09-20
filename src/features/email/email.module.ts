import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailSubscription } from 'src/services/email/email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, EmailSubscription],
  imports: []
})
export class EmailModule { }
