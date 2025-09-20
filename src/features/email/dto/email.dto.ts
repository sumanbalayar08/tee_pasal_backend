import { IsEmail, IsString } from 'class-validator';

export class SubscribeEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}