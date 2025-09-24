import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class FollowingService {
  constructor(private prisma: PrismaService) { }

  async toggleFollow(userId: string, artistId: string) {
    const existing = await this.prisma.follow.findFirst({
      where: { followerId: userId, followingId: artistId },
    });

    if (existing) {
      await this.prisma.follow.delete({ where: { id: existing.id } });
      return { message: 'Unfollowed successfully' };
    }

    await this.prisma.follow.create({
      data: { followerId: userId, followingId: artistId },
    });

    return { message: 'Followed successfully' };
  }
}
