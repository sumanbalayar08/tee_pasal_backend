import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PublishDesignDto, UpdateDesignDto } from './dto/design.dto';
import { FileUploadService } from 'src/services/spaces/file-upload.service';
import { DesignStatus } from '@prisma/client';
import HttpException from 'src/common/exceptions/http-exception.service';

@Injectable()
export class DesignService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly prisma: PrismaService
  ) { }

  async createDraftDesign(userId: string) {
    try {
      const existingDraft = await this.prisma.design.findFirst({
        where: { artistId: userId, status: 'DRAFT' },
      });

      if (existingDraft) return { id: existingDraft.id };

      const newDraft = await this.prisma.design.create({
        data: { artistId: userId, status: 'DRAFT' },
      });

      return { id: newDraft.id };
    } catch (err) {
      console.error(err);
      throw HttpException.internalServerError('Failed to create draft design');
    }
  }

  async updateDesign(dto: UpdateDesignDto, file: Express.Multer.File, userId: string) {
    try {
      const design = await this.prisma.design.findUnique({ where: { id: dto.id } });
      if (!design || design.artistId !== userId)
        throw HttpException.unauthorized('Not authorized to update this design');

      const { id, tags, ...rest } = dto;
      const updateData: any = { ...rest };

      if (file) {
        if (design.imageUrl) {
          const oldKey = design.imageUrl.split('.com/')[1];
          await this.fileUploadService.deleteFromSpaces(oldKey);
        }

        const fileName = `designs/user_${userId}/${Date.now()}-${file.originalname}`;
        updateData.imageUrl = await this.fileUploadService.uploadToSpaces(
          file.buffer,
          fileName,
          file.mimetype
        );
      }

      updateData.tags = Array.isArray(tags) ? Array.from(new Set(tags)) : [];

      const updatedDesign = await this.prisma.design.update({
        where: { id: dto.id },
        data: updateData,
      });

      return { url: updatedDesign.imageUrl };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw HttpException.internalServerError('Failed to update design');
    }
  }

  // design.service.ts
  async publishDesign(
    dto: PublishDesignDto,
    files: { frontImages?: Express.Multer.File[]; backImages?: Express.Multer.File[] },
    userId: string,
  ) {
    try {
      const design = await this.prisma.design.findUnique({
        where: { id: dto.designId },
      });
      if (!design) throw HttpException.notFound('Design not found');

      // Validate file count matches product count
      const expectedFileCount = dto.products.length * 2; // front + back for each product
      const actualFileCount = (files.frontImages?.length || 0) + (files.backImages?.length || 0);

      if (expectedFileCount !== actualFileCount) {
        throw HttpException.badRequest(
          `Expected ${expectedFileCount} images (front+back for ${dto.products.length} products), got ${actualFileCount}`
        );
      }

      await this.prisma.$transaction(async (tx) => {
        // Step 1: Fetch existing products for this design
        const existingProducts = await tx.product.findMany({
          where: { designId: dto.designId },
        });

        // Step 2: Delete existing images from storage
        for (const p of existingProducts) {
          try {
            await this.fileUploadService.deleteFromSpaces(p.imageUrl);
          } catch (err) {
            console.warn(`Failed to delete existing product image: ${p.imageUrl}`, err);
          }
        }

        // Step 3: Delete existing products from DB
        await tx.product.deleteMany({
          where: { designId: dto.designId },
        });

        // Step 4: Insert new products
        for (let i = 0; i < dto.products.length; i++) {
          const product = dto.products[i];
          const frontFile = files.frontImages?.[i];
          const backFile = files.backImages?.[i];

          if (!frontFile || !backFile) {
            throw HttpException.badRequest(
              `Both front and back images required for ${product.productCategory}`
            );
          }

          const frontUrl = await this.fileUploadService.uploadToSpaces(
            frontFile.buffer,
            `products/user_${userId}/${product.productCategory}/front-${Date.now()}.png`,
            'image/png',
          );

          const backUrl = await this.fileUploadService.uploadToSpaces(
            backFile.buffer,
            `products/user_${userId}/${product.productCategory}/back-${Date.now()}.png`,
            'image/png',
          );

          await tx.product.createMany({
            data: [
              {
                designId: dto.designId,
                productCategory: product.productCategory,
                color: product.color,
                placement: 'front',
                imageUrl: frontUrl,
              },
              {
                designId: dto.designId,
                productCategory: product.productCategory,
                color: product.color,
                placement: 'back',
                imageUrl: backUrl,
              },
            ],
          });
        }

        // Step 5: Update design status
        await tx.design.update({
          where: { id: dto.designId },
          data: { status: DesignStatus.APPROVED },
        });
      });

      return true;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw HttpException.internalServerError('Failed to publish design');
    }
  }

  async getBestSellers(limit = 10) {
    const designs = await this.prisma.design.findMany({
      where: { status: 'APPROVED' },
      include: {
        artist: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return designs.map((d) => ({
      id: d.id,
      name: d.title,
      imageUrl: d.imageUrl ?? '',
      basePrice: d.basePrice,
      artist: {
        id: d.artist.id,
        name: `${d.artist.firstName} ${d.artist.lastName}`,
        avatar: d.artist.avatarUrl ?? '',
      },
    }));
  }

  async getDesign(designId: string, userId: string) {
    try {
      const design = await this.prisma.design.findFirst({
        where: { id: designId, artistId: userId },
      });

      if (!design) throw HttpException.notFound('Design not found');

      return design;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw HttpException.internalServerError('Failed to fetch design');
    }
  }
}
