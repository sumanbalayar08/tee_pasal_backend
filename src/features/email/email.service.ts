import { Injectable } from '@nestjs/common';
import { SubscribeEmailDto } from './dto/email.dto';
import { EmailSubscription } from 'src/services/email/email.service';
import HttpException from 'src/common/exceptions/http-exception.service';

@Injectable()
export class EmailService {
  constructor(private readonly emailSubscription: EmailSubscription) {}

  async subscribe(subscribeEmailDto: SubscribeEmailDto) {
    try {
      await this.emailSubscription.sendSubscriptionConfirmation(
        subscribeEmailDto.email,
        subscribeEmailDto.name
      );

      return { status: true, message: 'Subscription confirmation email sent' };
    } catch (err) {
      console.error(err);
      throw HttpException.internalServerError(
        'Failed to send subscription confirmation email'
      );
    }
  }
}
