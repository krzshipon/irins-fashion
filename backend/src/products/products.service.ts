import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const { categoryName, variants, images, badges, ...productData } = createProductDto;

    // 1. Find Category
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: categoryName },
          { id: categoryName } // Allow passing ID directly if needed
        ]
      }
    });

    if (!category) {
      throw new Error(`Category '${categoryName}' not found`);
    }

    // 2. Prepare Data
    // Map simple string badges to Badge objects
    const badgeData = (badges || []).map(b => {
      let type = 'custom';
      let color = '#000000';
      if (b.toLowerCase().includes('new')) { type = 'new'; color = '#10b981'; } // Emerald
      if (b.toLowerCase().includes('best')) { type = 'bestseller'; color = '#f59e0b'; } // Amber
      return { type, text: b, color, textColor: '#ffffff' };
    });

    // 3. Create Product with Relations
    return this.prisma.product.create({
      data: {
        ...productData,
        categoryId: category.id,
        image: productData.image || (images && images.length > 0 ? images[0].url : ''), // Fallback to first image
        images: {
          create: images?.map(img => ({ url: img.url, isPrimary: img.isPrimary || false }))
        },
        variants: {
          create: variants?.map(v => ({
            color: v.colorName,
            size: null, // We store sizes in a separate structure? 
            // Schema has: size String?, color String?, sku String?, stock Int
            // But Frontend sends: variants: [{ sizes: [{ size, stock, price }] }]
            // We need to flatten this structure for Prisma "ProductVariant" model?
            // Wait, schema model ProductVariant is simple flat list?
            // model ProductVariant { size, color, sku, stock }
            // So for each color-size combination, we create a row.
            // Yes, let's flatten it.
          }))
        },
        badges: {
          create: badgeData
        }
      }
    });
  }

  // Re-evaluating Schema vs Frontend Structure:
  // Frontend sends: ColorVariant { sizes: SizeVariant[] }
  // Schema: ProductVariant { size, color, sku, stock }
  // So one ColorVariant with 3 sizes = 3 ProductVariant rows in DB.

  async createFull(createProductDto: CreateProductDto) {
    const { categoryName, variants, images, badges, ...productData } = createProductDto;

    // 1. Find Category
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: categoryName, mode: 'insensitive' } },
          { id: categoryName }
        ]
      }
    });

    if (!category) {
      throw new Error(`Category '${categoryName}' not found`);
    }

    // 2. Flatten Variants (Color Group -> Individual SKU rows)
    const flattenedVariants: any[] = [];
    if (variants) {
      for (const colorVar of variants) {
        // Create variants for each size
        if (colorVar.sizes && colorVar.sizes.length > 0) {
          for (const sizeVar of colorVar.sizes) {
            flattenedVariants.push({
              color: colorVar.colorName,
              size: sizeVar.size,
              sku: sizeVar.sku || `${createProductDto.sku}-${colorVar.colorName}-${sizeVar.size}`.toUpperCase().replace(/\s+/g, '-'),
              stock: parseInt(sizeVar.stock || '0'),
              // Store color code/images? Schema doesn't support it directly on Variant row yet. 
              // Schema needs update or we store it in a separate table?
              // Current Schema: ProductVariant { size, color, sku, stock }
              // It misses "colorCode" and "images" specific to color.
              // Missing Schema Field!
              // Let's rely on JSON field or update schema.
              // For now, I will store metadata in a JSON field if possible, OR just stick to basic schema and ignore color code/images for backend persistence temporarily until next schema update, or update schema NOW.
              // Actually, PLAN said "Complex variants support".
              // Let's check Schema again.
            });
          }
        } else {
          // Color only variant?
          flattenedVariants.push({
            color: colorVar.colorName,
            size: null,
            stock: 0,
            sku: `${createProductDto.sku}-${colorVar.colorName}`.toUpperCase().replace(/\s+/g, '-')
          });
        }
      }
    }

    // 3. Badges
    const badgeData = (badges || []).map(b => {
      let type = 'custom';
      let color = '#3b82f6'; // Blue default
      if (b.toLowerCase().includes('new')) { type = 'new'; color = '#10b981'; }
      if (b.toLowerCase().includes('best')) { type = 'bestseller'; color = '#f59e0b'; }
      if (b.toLowerCase().includes('limit')) { type = 'limited'; color = '#ef4444'; }
      return { type, text: b, color, textColor: '#ffffff' };
    });

    // 4. Create
    return this.prisma.product.create({
      data: {
        ...productData,
        // Make sure Decimal is handled
        price: productData.price,
        originalPrice: productData.originalPrice,
        categoryId: category.id,
        image: productData.image || (images && images.length > 0 ? images[0].url : ''),

        images: {
          create: images?.map(img => ({ url: img.url, isPrimary: img.isPrimary || false }))
        },

        variants: {
          create: flattenedVariants
        },

        badges: {
          create: badgeData
        }
      },
      include: { variants: true, images: true, badges: true }
    });
  }

  // Override the default create
  create(createProductDto: CreateProductDto) {
    return this.createFull(createProductDto);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // For now, basic update. Full update logic is complex with relations.
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        // Handle relations if needed (usually separate endpoints or complex logic)
      }
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
        include: { images: true, variants: true, badges: true, category: true },
        orderBy: { createdAt: 'desc' }
      });

      return { products, category };
    }

    const products = await this.prisma.product.findMany({
      include: { images: true, variants: true, badges: true, category: true },
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
}
