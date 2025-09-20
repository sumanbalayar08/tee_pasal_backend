import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { SubscribeEmailDto } from './dto/email.dto';

@Controller('api/subscribe')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('email')
  subscribe(@Body() subscribeEmailDto: SubscribeEmailDto) {
    return this.emailService.subscribe(subscribeEmailDto);
  }
}
