import { Module } from '@nestjs/common';
import { SpotlightService } from './spotlight/spotlight.service';
import { FollowService } from './follow/follow.service';
import { FollowController } from './follow/follow.controller';
import { SaveController } from './saves/save.controller';
import { LikeController } from './like/like.controller';
import { CommentController } from './comment/comment.controller';
import { SpotlightController } from './spotlight/spotlight.controller';
import { LikeService } from './like/like.service';
import { SaveService } from './saves/save.service';
import { CommentService } from './comment/comment.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [
    LikeController,
    SaveController,
    CommentController,
    FollowController,
    SpotlightController,
  ],
  providers: [
    PrismaService,
    LikeService,
    SaveService,
    CommentService,
    FollowService,
    SpotlightService,
  ],
  exports: [
    LikeService,
    SaveService,
    CommentService,
    FollowService,
    SpotlightService,
  ],
})
export class SocialModule { }
