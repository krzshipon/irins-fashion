import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(categorySlug?: string) {
    if (categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        // Option 1: Return empty if category not found? Or null category.
        return { products: [], category: null };
      }

      const products = await this.prisma.product.findMany({
        where: { categoryId: category.id },
        include: { images: true, variants: true, badges: true },
        orderBy: { createdAt: 'desc' }
      });

      return { products, category };
    }

    const products = await this.prisma.product.findMany({
      include: { images: true, variants: true, badges: true },
      orderBy: { createdAt: 'desc' }
    });

    return { products, category: null };
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, badges: true, category: true }
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
