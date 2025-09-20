import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class SaveService {
  constructor(private prisma: PrismaService) { }

  save(userId: string, designId: string) {
    return this.prisma.save.create({
      data: { userId, designId },
    });
  }

  unsave(userId: string, designId: string) {
    return this.prisma.save.deleteMany({
      where: { userId, designId },
    });
  }
}
