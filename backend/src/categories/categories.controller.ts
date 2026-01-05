import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create category (Admin)' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get active categories (Public)' })
  findAllActive() {
    return this.categoriesService.findAllActive();
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all categories (Admin)' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder categories (Admin)' })
  reorder(@Body() body: { orderedIds: string[] }) {
    console.log('Reorder Body:', body);
    return this.categoriesService.reorder(body.orderedIds);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category (Admin)' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Toggle category status (Admin)' })
  toggleStatus(@Param('id') id: string) {
    return this.categoriesService.toggleStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category (Admin)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
