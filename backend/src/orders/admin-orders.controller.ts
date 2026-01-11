import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { OrderStatus } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(AdminGuard)
export class AdminOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * Get all orders with filters (admin only)
     */
    @Get()
    async findAll(
        @Query('status') status?: OrderStatus,
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.ordersService.findAll({
            status,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }

    /**
     * Get order statistics (admin only)
     */
    @Get('stats')
    async getStats() {
        return this.ordersService.getStats();
    }

    /**
     * Get single order by ID (admin only)
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    /**
     * Update order status (admin only)
     */
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, dto);
    }
}
