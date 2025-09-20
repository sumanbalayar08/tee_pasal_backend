import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class UpdateUserDto extends SignUpUserDto {
  @IsString()
  id: string;
}
