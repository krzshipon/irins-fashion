import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateOrderDto, userId?: string) {
        // Generate a readable order ID
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

        const order = await this.prisma.order.create({
            data: {
                id: orderNumber,
                userId: userId || null,
                subtotal: dto.subtotal,
                shippingCost: dto.shippingCost,
                total: dto.total,
                discount: dto.couponDiscount || 0,
                paymentMethod: dto.paymentMethod,
                shippingAddressSnapshot: {
                    ...dto.shippingDetails,
                    appliedCoupon: dto.appliedCoupon,
                },
                items: {
                    create: dto.items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        productImage: item.productImage,
                        quantity: item.quantity,
                        price: item.price,
                        variantSnapshot: item.variantSnapshot || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return order;
    }

    async findAll(filters?: {
        status?: OrderStatus;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const { status, search, page = 1, limit = 20 } = filters || {};

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                {
                    shippingAddressSnapshot: {
                        path: ['fullName'],
                        string_contains: search,
                    },
                },
                {
                    shippingAddressSnapshot: {
                        path: ['phone'],
                        string_contains: search,
                    },
                },
            ];
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    items: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            mobile: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: {
                                    where: { isPrimary: true },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        mobile: true,
                        email: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException(`Order ${id} not found`);
        }

        return order;
    }

    async findByUser(userId: string) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return orders;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new NotFoundException(`Order ${id} not found`);
        }

        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
            include: {
                items: true,
            },
        });
    }

    async getStats() {
        const [
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
        ] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.count({ where: { status: 'PROCESSING' } }),
            this.prisma.order.count({ where: { status: 'SHIPPED' } }),
            this.prisma.order.count({ where: { status: 'DELIVERED' } }),
            this.prisma.order.count({ where: { status: 'CANCELLED' } }),
        ]);

        return {
            total: totalOrders,
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
        };
    }
}
