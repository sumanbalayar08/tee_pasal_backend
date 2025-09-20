import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EsewaService {
  private readonly secret = '8gBm/:&EnhH.1/q';

  createSignature({
    amount,
    tax_amount,
    transaction_uuid,
    product_code,
  }: {
    amount: number;
    tax_amount: number;
    transaction_uuid: string;
    product_code: string;
  }): string {
    const message = `total_amount=${amount + tax_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    return crypto.createHmac('sha256', this.secret).update(message).digest('base64');
  }

  verifySignature(data: any): boolean {
    const signedFields = data.signed_field_names.split(',');
    const message = signedFields.map((f) => `${f}=${data[f]}`).join(',');
    const hmac = crypto.createHmac('sha256', this.secret).update(message).digest('base64');
    return hmac === data.signature;
  }
}
