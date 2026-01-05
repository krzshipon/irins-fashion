import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsObject, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class ProductImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsBoolean()
    @IsOptional()
    isPrimary?: boolean;
}

class ProductVariantSizeDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsOptional()
    price?: string;

    @IsString()
    @IsOptional()
    stock?: string;

    @IsString()
    @IsOptional()
    sku?: string;
}

class ProductVariantDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    colorName?: string;

    @IsString()
    @IsOptional()
    colorCode?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantSizeDto)
    @IsOptional()
    sizes?: ProductVariantSizeDto[];
}

class ProductBadgeDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['new', 'discount', 'bestseller', 'custom'])
    type: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    textColor?: string;
}

class ProductDiscountDto {
    @IsString()
    @IsEnum(['percentage', 'flat'])
    type: string;

    @IsNumber()
    value: number;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsOptional()
    localizedNames?: Record<string, string>;

    @IsObject()
    @IsOptional()
    localizedDescriptions?: Record<string, string>;

    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    originalPrice?: number;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductDiscountDto)
    discount?: ProductDiscountDto;

    @IsString()
    @IsOptional()
    sizeChart?: string;

    @IsString()
    @IsNotEmpty()
    categoryName: string; // We'll look up ID by Name or pass ID directly if preferred

    @IsString()
    @IsOptional()
    image?: string; // Main image URL

    @IsBoolean()
    @IsOptional()
    isNew?: boolean;

    @IsString()
    @IsOptional()
    status?: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductImageDto)
    images?: ProductImageDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    variants?: ProductVariantDto[];

    @IsArray()
    @IsOptional()
    badges?: string[]; // Simple string array from Frontend, will map to ProductBadgeDto internally if needed, or update Frontend to send full objects.
    // Actually schema has badges as relation. Frontend sends string array currently in ProductForm.tsx: "badges: [] as string[]".
    // We should probably accept string[] and map it in service, or update frontend to be richer.
    // For now let's stick to frontend sending simple strings and we create Badges from them.
}
