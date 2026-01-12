import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Banner, Prisma } from '@prisma/client';

@Injectable()
export class BannersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.BannerCreateInput): Promise<Banner> {
        return this.prisma.banner.create({
            data,
        });
    }

    async findAllAdmin(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.BannerWhereInput;
        orderBy?: Prisma.BannerOrderByWithRelationInput;
    }): Promise<Banner[]> {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.banner.findMany({
            skip,
            take,
            where,
            orderBy: orderBy || { sortOrder: 'asc' },
        });
    }

    async findActive(): Promise<Banner[]> {
        const now = new Date();
        return this.prisma.banner.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: now } },
                ],
                AND: [
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: now } },
                        ]
                    }
                ]
            },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async findOne(id: string): Promise<Banner | null> {
        return this.prisma.banner.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Prisma.BannerUpdateInput): Promise<Banner> {
        return this.prisma.banner.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Banner> {
        return this.prisma.banner.delete({
            where: { id },
        });
    }

    async count(where: Prisma.BannerWhereInput): Promise<number> {
        return this.prisma.banner.count({ where });
    }
}
