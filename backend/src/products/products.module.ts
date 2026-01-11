import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdminProductsController } from './admin-products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }

