// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProductDetails(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        design: {
          include: {
            artist: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Generate thumbnails - using design image and product image
    const thumbnails = [
      { id: 1, src: product.imageUrl, alt: 'Front view' },
      { id: 2, src: product.design.imageUrl, alt: 'Design detail' },
      { id: 3, src: '/api/placeholder/back/500/500', alt: 'Back view' }, // Static or generate back view
    ];

    // Get available colors for this design
    const availableColors = await this.prisma.product.findMany({
      where: { designId: product.designId },
      select: { color: true, imageUrl: true },
      distinct: ['color'],
    });

    return {
      id: product.id,
      name: `${product.design.title} - ${this.formatProductCategory(product.productCategory)}`,
      designer: `${product.design.artist.firstName} ${product.design.artist.lastName}`,
      description: product.design.description,
      basePrice: product.design.basePrice,
      compareAtPrice: product.design.basePrice ? product.design.basePrice * 2 : 32, // 50% off
      color: product.color,
      availableColors: availableColors.map(c => ({
        color: c.color,
        imageUrl: c.imageUrl,
      })),
      category: product.productCategory,
      placement: product.placement,
      design: {
        id: product.design.id,
        title: product.design.title,
        description: product.design.description,
        tags: product.design.tags,
        artist: product.design.artist,
      },
      thumbnails,
      rating: 4.0, // You can calculate this from reviews
      reviewCount: 1245, // You can calculate this from reviews
    };
  }

  private formatProductCategory(category: string): string {
    const categoryMap = {
      TSHIRT: 'T-Shirt',
      FULLSLEEVE: 'Full Sleeve Shirt',
      CROP: 'Crop Top',
      POLO: 'Polo Shirt',
      SWEATSHIRT: 'Sweatshirt',
    };
    return categoryMap[category] || category;
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { designId: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.findMany({
      where: {
        designId: product.designId,
        id: { not: productId },
      },
      include: {
        design: {
          include: {
            artist: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      take: 4,
    });
  }
}