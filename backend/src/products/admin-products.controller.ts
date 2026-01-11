import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('admin/products')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products (admin - includes all statuses)' })
    findAll(@Query('category') categorySlug?: string, @Query('take') take?: number) {
        return this.productsService.findAllAdmin(categorySlug, take);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID (admin - includes all statuses)' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOneAdmin(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product by ID' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product by ID' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
