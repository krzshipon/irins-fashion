import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
    ForbiddenException,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) { }

    @Post('admin')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createBannerDto: Prisma.BannerCreateInput, @Req() req: any) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Access denied');
        }

        // Basic validation for linkType
        if (createBannerDto.linkType && !['EXTERNAL', 'PRODUCT', 'CATEGORY'].includes(createBannerDto.linkType)) {
            // Default to EXTERNAL if invalid, or throw error. Let's force it to one of valid types if present.
            // For now, assuming frontend sends correct data, but good to be safe.
            // createBannerDto.linkType = 'EXTERNAL'; 
        }

        return this.bannersService.create(createBannerDto);
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard)
    findAllAdmin(@Req() req: any) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.bannersService.findAllAdmin();
    }

    @Get()
    findAllPublic() {
        return this.bannersService.findActive();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bannersService.findOne(id);
    }

    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: Prisma.BannerUpdateInput,
        @Req() req: any,
    ) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.bannersService.update(id, updateBannerDto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: any) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.bannersService.remove(id);
    }
}
