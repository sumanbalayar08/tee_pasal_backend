import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EsewaService } from './esewa.service';
import { Response } from 'express';

@Controller('esewa')
export class EsewaController {
  constructor(private readonly esewaService: EsewaService) { }

  @Get('verify')
  verify(@Query('data') token: string, @Res() res: Response) {
    if (!token) {
      return res.status(400).json({ result: 'Missing token' });
    }

    const decodedData = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(decodedData);

    if (this.esewaService.verifySignature(data)) {
      return res.send(`
        <h1>✅ Payment Successful</h1>
        <p>Transaction ID: ${data.transaction_uuid}</p>
        <p>Status: ${data.status}</p>
      `);
    } else {
      return res.status(403).json({ result: 'Invalid Signature' });
    }
  }

  @Get('failure')
  failure(@Res() res: Response) {
    res.send('<h1>❌ Payment Failed</h1><p>Please try again.</p>');
  }

  @Post('generate-signature')
  generateSignature(@Body() body: any) {
    const { amount, tax_amount, transaction_uuid, product_code } = body;
    const signature = this.esewaService.createSignature({
      amount,
      tax_amount,
      transaction_uuid,
      product_code,
    });
    return { signature };
  }

}
