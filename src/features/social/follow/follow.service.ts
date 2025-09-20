import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) { }

  follow(followerId: string, followingId: string) {
    return this.prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  unfollow(followerId: string, followingId: string) {
    return this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true },
    });
  }
}
