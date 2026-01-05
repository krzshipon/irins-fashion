import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAllActive() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async toggleStatus(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return this.prisma.category.update({
      where: { id },
      data: { isActive: !category?.isActive }
    });
  }

  async remove(id: string) {
    // 1. Fetch data to find images
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: { images: true }
        }
      }
    });

    if (category) {
      const imageUrls: string[] = [];

      // Category image
      if (category.image) imageUrls.push(category.image);

      // Product images
      category.products.forEach(product => {
        if (product.image) imageUrls.push(product.image);
        product.images.forEach(img => imageUrls.push(img.url));
      });

      // 2. Delete from storage
      if (imageUrls.length > 0) {
        await this.uploadService.deleteFiles(imageUrls);
      }
    }

    // 3. Delete from DB (Cascade will handle products)
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
