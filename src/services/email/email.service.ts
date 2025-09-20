import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSubscription {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendSubscriptionConfirmation(to: string, name?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Your Company" <${this.configService.get<string>('email.user')}>`,
        to,
        subject: 'Subscription Confirmation',
        html: `
          <h1>Thank you for subscribing${name ? ', ' + name : ''}!</h1>
          <p>We're excited to have you on board. You'll now receive updates and exclusive offers.</p>
          <p>Best regards,<br/>Your Company Team</p>
        `,
      });
      return {status: true, message: "User subscribed successfully"}
    } catch (error) {
      console.error('Error sending subscription email:', error);
      throw new InternalServerErrorException('Failed to send subscription email');
    }
  }
}
