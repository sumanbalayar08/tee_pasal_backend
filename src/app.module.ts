import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { AppController } from './app.controller';
import { SocialModule } from './features/social/social.module';
import { DesignModule } from './features/design/design.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { EmailModule } from './features/email/email.module';
import authConfig from './config/auth.config';
import emailConfig from './config/email.config';
import { UsersModule } from './features/users/users.module';
import { ArtistModule } from './features/artist/artist.module';
import { FollowingModule } from './features/following/following.module';
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [authConfig, emailConfig]
    }),
    PrismaModule,
    DesignModule,
    SocialModule,
    AuthModule,
    EmailModule,
    UsersModule,
    ArtistModule,
    FollowingModule,
    ProductsModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
