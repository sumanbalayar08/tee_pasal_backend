import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DesignStatus } from '@prisma/client';
import { UpdateArtistDto } from './dto/artist.dto';
import { FileUploadService } from 'src/services/spaces/file-upload.service';
import HttpException from 'src/common/exceptions/http-exception.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private prisma: PrismaService,
  ) { }

  async getArtistProfile(artistId: string) {
    const artist = await this.prisma.user.findUnique({
      where: { id: artistId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        bannerUrl: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
        designs: {
          select: {
            id: true,
            title: true,
            description: true,
            basePrice: true,
            imageUrl: true,
          },
          where: { status: DesignStatus.APPROVED },
        },
        social: true,
      },
    });

    if (!artist) {
      throw HttpException.notFound('Artist profile not found');
    }

    return artist;
  }

  async updateArtist(id: string, dto: UpdateArtistDto, files?: {
    avatar?: Express.Multer.File[];
    banner?: Express.Multer.File[];
  },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { social: true },
    });

    if (!user) {
      throw HttpException.notFound('User not found');
    }

    let avatarUrl = user.avatarUrl;
    let bannerUrl = user.bannerUrl;

    try {
      if (files?.avatar?.length) {
        if (user.avatarUrl) {
          const oldKey = this.extractKeyFromUrl(user.avatarUrl);
          await this.fileUploadService.deleteFromSpaces(oldKey);
        }
        avatarUrl = await this.fileUploadService.uploadToSpaces(
          files.avatar[0].buffer,
          `avatar/user_${id}/avatar-${Date.now()}`,
          files.avatar[0].mimetype,
        );
      }

      if (files?.banner?.length) {
        if (user.bannerUrl) {
          const oldKey = this.extractKeyFromUrl(user.bannerUrl);
          await this.fileUploadService.deleteFromSpaces(oldKey);
        }
        bannerUrl = await this.fileUploadService.uploadToSpaces(
          files.banner[0].buffer,
          `banner/user_${id}/banner-${Date.now()}`,
          files.banner[0].mimetype,
        );
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          bio: dto.bio,
          phone: dto.phone,
          avatarUrl,
          bannerUrl,
          social: dto.social
            ? {
              upsert: {
                create: { ...dto.social },
                update: { ...dto.social },
              },
            }
            : undefined,
        },
        include: { social: true },
      });
    } catch (error) {
      throw HttpException.internalServerError(
        error.message || 'Failed to update artist profile',
      );
    }
  }

  private extractKeyFromUrl(url: string): string {
    const parts = url.split('.com/');
    if (!parts[1]) {
      throw HttpException.badRequest('Invalid file URL format');
    }
    return parts[1];
  }
}
