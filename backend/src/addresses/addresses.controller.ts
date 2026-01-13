
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

// DTOs
export class CreateAddressDto {
    @IsString()
    label: string;

    @IsString()
    recipientName: string;

    @IsString()
    address: string;

    @IsString()
    division: string;

    @IsString()
    phone: string;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class UpdateAddressDto {
    @IsString()
    @IsOptional()
    label?: string;

    @IsString()
    @IsOptional()
    recipientName?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    division?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    create(@Request() req: any, @Body() createAddressDto: CreateAddressDto) {
        return this.addressesService.create(req.user.id, createAddressDto as any);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.addressesService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressesService.update(id, req.user.id, updateAddressDto as any);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.remove(id, req.user.id);
    }
}
