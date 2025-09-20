import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UpdateDesignDto } from './dto/design.dto';
import { FileUploadService } from 'src/services/spaces/file-upload.service';

@Injectable()
export class DesignService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly prisma: PrismaService
  ) { }

  async createDraftDesign(userId: string) {
    const existingDraft = await this.prisma.design.findFirst({
      where: { artistId: userId, status: 'DRAFT' },
    });

    if (existingDraft) {
      return { id: existingDraft.id };
    }

    const newDraft = await this.prisma.design.create({
      data: { artistId: userId, status: 'DRAFT' },
    });

    return { id: newDraft.id };
  }


  async updateDesign(dto: UpdateDesignDto, file: Express.Multer.File, userId: string) {
    const design = await this.prisma.design.findUnique({ where: { id: dto.id } });
    if (!design || design.artistId !== userId) throw new Error('Not authorized');

    const { id, tags, ...rest } = dto;

    const updateData = { ...rest };

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

    // Start a transaction for tags and design update
    const updated = await this.prisma.$transaction(async (tx) => {
      // Update design fields
      const updatedDesign = await tx.design.update({
        where: { id: dto.id },
        data: updateData,
      });

      // Delete existing tags
      await tx.tag.deleteMany({ where: { designId: dto.id } });

      // Create new tags
      if (tags && tags.length > 0) {
        const tagData = tags.map((name) => ({ name, designId: dto.id }));
        await tx.tag.createMany({ data: tagData });
      }

      return updatedDesign;
    });

    return { url: updated.imageUrl };
  }

  async getDesign(designId: string, userId: string) {
    return this.prisma.design.findFirst({
      where: { id: designId, artistId: userId },
      include: {
        tags: {
          select: { name: true }
        }
      }
    })
  }
}
