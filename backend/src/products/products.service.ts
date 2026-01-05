import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  // --- Helpers ---

  private async findCategory(identifier: string) {
    return this.prisma.category.findFirst({
      where: {
        OR: [
          { id: identifier },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
    });
  }

  private mapBadges(badges: string[]) {
    return badges?.map((badgeText) => {
      let type = 'custom';
      let color = '#3b82f6';
      const lower = badgeText.toLowerCase();

      if (lower.includes('new')) { type = 'new'; color = '#10b981'; }
      else if (lower.includes('best')) { type = 'bestseller'; color = '#f59e0b'; }
      else if (lower.includes('limit') || lower.includes('sale')) { type = 'limited'; color = '#ef4444'; }

      return { type, text: badgeText, color, textColor: '#ffffff' };
    }) || [];
  }

  private mapColors(variants: any[] = []) {
    return variants?.map((colorGroup) => ({
      name: colorGroup.colorName,
      code: colorGroup.colorCode,
      images: {
        create: colorGroup.images?.map((url: string) => ({
          url: url,
          isPrimary: false
        }))
      },
      variants: {
        create: colorGroup.sizes?.map((sizeVar: any) => ({
          size: sizeVar.size,
          sku: sizeVar.sku,
          stock: sizeVar.stock ? +sizeVar.stock : 0,
          price: sizeVar.price ? +sizeVar.price : undefined
        }))
      }
    })) || [];
  }

  // --- CRUD Operations ---

  async create(createProductDto: CreateProductDto) {
    try {
      const {
        categoryName,
        variants,
        images,
        badges,
        discount,
        localizedNames,
        localizedDescriptions,
        ...productData
      } = createProductDto;

      const category = await this.findCategory(categoryName);
      if (!category) {
        throw new BadRequestException(`Category '${categoryName}' not found`);
      }

      return await this.prisma.product.create({
        data: {
          ...productData,
          category: { connect: { id: category.id } },
          discount: discount as any,
          localizedNames: localizedNames as any,
          localizedDescriptions: localizedDescriptions as any,
          images: {
            create: images?.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
          },
          colors: {
            create: this.mapColors(variants || [])
          },
          badges: {
            create: this.mapBadges(badges || []),
          },
        },
        include: {
          colors: { include: { variants: true, images: true } },
          images: true,
          badges: true,
          category: true
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {
      categoryName,
      variants,
      images,
      badges,
      discount,
      localizedNames,
      localizedDescriptions,
      ...rest
    } = updateProductDto;

    // Resolve Category if changed
    let categoryConnect = {};
    if (categoryName) {
      const category = await this.findCategory(categoryName);
      if (!category) throw new BadRequestException(`Category '${categoryName}' not found`);
      categoryConnect = { category: { connect: { id: category.id } } };
    }

    // Transaction to ensure atomicity of delete-then-create ops
    return this.prisma.$transaction(async (tx) => {
      // 1. Cleanup existing relations
      if (images) await tx.productImage.deleteMany({ where: { productId: id } });
      if (badges) await tx.productBadge.deleteMany({ where: { productId: id } });
      if (variants) await tx.productColor.deleteMany({ where: { productId: id } });

      // 2. Update Product
      const product = await tx.product.update({
        where: { id },
        data: {
          ...rest,
          ...categoryConnect,
          discount: discount as any,
          localizedNames: localizedNames as any,
          localizedDescriptions: localizedDescriptions as any,

          // Re-create relations
          images: images ? {
            create: images.map(img => ({ url: img.url, isPrimary: img.isPrimary }))
          } : undefined,

          badges: badges ? {
            create: this.mapBadges(badges)
          } : undefined,

          colors: variants ? {
            create: this.mapColors(variants)
          } : undefined,
        },
        include: {
          colors: { include: { variants: true, images: true } },
          images: true,
          badges: true,
          category: true
        }
      });

      return product;
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async findAll(categorySlug?: string) {
    if (categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        return { products: [], category: null };
      }

      const products = await this.prisma.product.findMany({
        where: { categoryId: category.id },
        include: { images: true, colors: { include: { variants: true, images: true } }, badges: true, category: true },
        orderBy: { createdAt: 'desc' },
      });

      return { products, category };
    }

    const products = await this.prisma.product.findMany({
      include: { images: true, colors: { include: { variants: true, images: true } }, badges: true, category: true },
      orderBy: { createdAt: 'desc' },
    });

    return { products, category: null };
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true, colors: { include: { variants: true, images: true } }, badges: true, category: true },
    });
  }
}
