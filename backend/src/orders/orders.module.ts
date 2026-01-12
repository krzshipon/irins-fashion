import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
        }),
    ],
    controllers: [OrdersController, AdminOrdersController],
    providers: [OrdersService, OptionalJwtAuthGuard],
    exports: [OrdersService],
})
export class OrdersModule { }

