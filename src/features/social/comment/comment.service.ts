import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }

  async comment(userId: string, designId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        userId,
        designId,
        content,
      },
    });
  }

  async getComments(designId: string) {
    return this.prisma.comment.findMany({
      where: { designId },
      include: { user: true },
    });
  }
}
