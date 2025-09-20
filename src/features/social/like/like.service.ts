import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) { }

  like(userId: string, designId: string) {
    return this.prisma.like.create({
      data: { userId, designId },
    });
  }

  unlike(userId: string, designId: string) {
    return this.prisma.like.deleteMany({
      where: { userId, designId },
    });
  }
}
