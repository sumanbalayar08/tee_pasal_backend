import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expirationTime: process.env.JWT_EXPIRATION_TIME,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET_KEY,
    expirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
}));
