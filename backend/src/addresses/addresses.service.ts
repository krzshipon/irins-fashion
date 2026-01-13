
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: Prisma.AddressCreateInput) {
        // If setting as default, unset other defaults
        if (data.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        // Ensure userId is strictly connected (though it's in data usually, 
        // better to be explicit if data comes from controller body)
        // Here we assume data.user is handled or we modify the input.
        // Actually, Prisma.AddressCreateInput requires 'user' relation input.
        // It's often cleaner to take a plain object and construct the CreateInput.

        return this.prisma.address.create({
            data: {
                ...data,
                user: { connect: { id: userId } },
            } as any, // Cast to avoid complex type matching for now, or refine DTO
        });
    }

    async findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }, // Defaults first
        });
    }

    async findOne(id: string, userId: string) {
        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found`);
        }
        return address;
    }

    async update(id: string, userId: string, data: Prisma.AddressUpdateInput) {
        // Ensure the address belongs to the user
        await this.findOne(id, userId);

        if (data.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.address.delete({
            where: { id },
        });
    }
}
