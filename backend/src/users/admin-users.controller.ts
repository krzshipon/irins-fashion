import {
    Controller,
    Get,
    Query,
    UseGuards,
    Delete,
    Param,
    Patch,
    Body,
    ForbiddenException,
    Req,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
    constructor(private readonly usersService: UsersService) { }

    private checkAdminRole(user: any) {
        if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Access denied');
        }
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '',
        @Query('role') role: string = '',
        @Req() req: any
    ) {
        this.checkAdminRole(req.user);

        const skip = (Number(page) - 1) * Number(limit);
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { mobile: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role as UserRole;
        }

        const [users, total] = await Promise.all([
            this.usersService.findAll({
                skip: Number(skip),
                take: Number(limit),
                where,
                orderBy: { createdAt: 'desc' },
            }),
            this.usersService.count(where),
        ]);

        const usersWithStats = users.map(user => {
            const totalSpent = (user as any).orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0;
            const ordersCount = (user as any)._count?.orders || 0;
            const { password, ...rest } = user;
            return {
                ...rest,
                totalSpent,
                ordersCount,
                isActive: true // Schema doesn't have isActive yet
            };
        });

        return {
            users: usersWithStats,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }

    @Get('stats')
    async getStats(@Req() req: any) {
        this.checkAdminRole(req.user);

        const [total, customers, admins] = await Promise.all([
            this.usersService.count({}),
            this.usersService.count({ role: UserRole.CUSTOMER }),
            this.usersService.count({ role: { in: [UserRole.ADMIN, UserRole.SUPERADMIN] } }),
        ]);

        return {
            total,
            customers,
            admins,
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        this.checkAdminRole(req.user);

        const user = await this.usersService.findOne({ id });
        if (!user) throw new NotFoundException('User not found');

        // Prevent deleting SUPERADMIN
        if (user.role === UserRole.SUPERADMIN) {
            throw new ForbiddenException('Cannot delete Super Admin');
        }

        // Prevent deleting self
        if (user.id === req.user.id) {
            throw new ForbiddenException('Cannot delete yourself');
        }

        await this.usersService.delete({ id });
        return { success: true, message: 'User deleted successfully' };
    }

    @Patch(':id/role')
    async updateRole(
        @Param('id') id: string,
        @Body('role') role: UserRole,
        @Req() req: any
    ) {
        this.checkAdminRole(req.user);

        // Only SUPERADMIN can change roles to/from ADMIN/SUPERADMIN
        if (req.user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Only Super Admin can manage roles');
        }

        const user = await this.usersService.findOne({ id });
        if (!user) throw new NotFoundException('User not found');

        if (user.role === UserRole.SUPERADMIN) {
            throw new ForbiddenException('Cannot change Super Admin role');
        }

        const updatedUser = await this.usersService.updateUser({
            where: { id },
            data: { role },
        });

        const { password, ...rest } = updatedUser;
        return rest;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: any,
        @Req() req: any
    ) {
        this.checkAdminRole(req.user);

        // Only allow updating name, email, mobile
        // Do not allow updating Role or Password here
        const { role, password, id: _id, ...cleanData } = data;

        const updatedUser = await this.usersService.updateUser({
            where: { id },
            data: cleanData,
        });

        const { password: _, ...rest } = updatedUser;
        return rest;
    }
}
