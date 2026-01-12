import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * Create a new order (supports both guest and authenticated users)
     * Uses OptionalJwtAuthGuard to extract user if logged in
     */
    @UseGuards(OptionalJwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateOrderDto, @Request() req: any) {
        // If user is authenticated, associate the order with them
        const userId = req.user?.id || null;

        const order = await this.ordersService.create(dto, userId);
        return {
            success: true,
            orderId: order.id,
            message: 'Order placed successfully',
        };
    }

    /**
     * Get order by ID (public - for order tracking)
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    /**
     * Get authenticated user's orders
     */
    @UseGuards(JwtAuthGuard)
    @Get('my/all')
    async findMyOrders(@Request() req: any) {
        return this.ordersService.findByUser(req.user.id);
    }
}
