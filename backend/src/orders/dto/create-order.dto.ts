import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class OrderItemDto {
    @IsString()
    productId: string;

    @IsString()
    productName: string;

    @IsOptional()
    @IsString()
    productImage: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    quantity: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    price: number;

    @IsOptional()
    variantSnapshot?: any; // { color?: string, size?: string }
}

class ShippingDetailsDto {
    @IsString()
    fullName: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    division: string;

    @IsString()
    deliveryZone: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @Transform(({ value }) => Number(value))
    @IsNumber()
    subtotal: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    shippingCost: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    total: number;

    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    @IsNumber()
    couponDiscount?: number;

    @ValidateNested()
    @Type(() => ShippingDetailsDto)
    shippingDetails: ShippingDetailsDto;

    @IsString()
    paymentMethod: string;

    @IsOptional()
    appliedCoupon?: {
        code: string;
        discountAmount: number;
    };
}
