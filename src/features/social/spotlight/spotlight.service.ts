import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class SpotlightService {
  constructor(private prisma: PrismaService) { }

  create(artistId: string, content: string) {
    return this.prisma.spotlight.create({
      data: { artistId, content },
    });
  }

  getActiveSpotlights() {
    return this.prisma.spotlight.findMany({
      where: { isActive: true },
      include: { artist: true },
    });
  }
}
