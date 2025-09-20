import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpUserDto, LoginUserDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import HttpException from 'src/common/exceptions/http-exception.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService
  ) { }

  async create(dto: SignUpUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const role = await this.prisma.role.findUnique({
        where: { name: dto.role },
      });

      if (!role) throw HttpException.notFound('Role does not exist');

      const { role: _role, ...rest } = dto;

      await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          roleId: role.id,
        },
      });

      return { status: true, message: 'User signed up successfully' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw HttpException.badRequest('Email already exists');
        }
      }
      console.error(err);
      throw HttpException.internalServerError(
        'Something went wrong while creating user'
      );
    }
  }

  async login(dto: LoginUserDto, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw HttpException.unauthorized('Incorrect credentials');

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid)
        throw HttpException.unauthorized('Invalid credentials');

      const payload = { id: user.id };

      const accessToken = this.jwt.sign(payload, {
        secret: this.configService.get<string>('auth.jwt.secret'),
        expiresIn: this.configService.get<string>('auth.jwt.expirationTime'),
      });

      const refreshToken = this.jwt.sign(payload, {
        secret: this.configService.get<string>('auth.refreshToken.secret'),
        expiresIn: this.configService.get<string>(
          'auth.refreshToken.expirationTime'
        ),
      });

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return { status: true, message: 'Login successful' };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw HttpException.internalServerError(
        'Something went wrong while logging in'
      );
    }
  }

  async refreshToken(oldToken: string, res: Response) {
    try {
      const payload = this.jwt.verify(oldToken, {
        secret: this.configService.get<string>('auth.refreshToken.secret'),
      });

      const accessToken = this.jwt.sign(
        { id: payload.id },
        {
          secret: this.configService.get<string>('auth.jwt.secret'),
          expiresIn: this.configService.get<string>(
            'auth.jwt.expirationTime'
          ),
        }
      );

      const refreshToken = this.jwt.sign(
        { id: payload.id },
        {
          secret: this.configService.get<string>('auth.refreshToken.secret'),
          expiresIn: this.configService.get<string>(
            'auth.refreshToken.expirationTime'
          ),
        }
      );

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return { status: true, message: 'Token refreshed successfully' };
    } catch (err) {
      console.error(err);
      throw HttpException.unauthorized('Invalid or expired refresh token');
    }
  }

  async getMe(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: { select: { name: true } },
          phone: true,
          bio: true,
          avatarUrl: true,
        },
      });

      if (!user) throw HttpException.notFound('User not found');

      return user;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw HttpException.internalServerError(
        'Something went wrong while fetching user'
      );
    }
  }
}
