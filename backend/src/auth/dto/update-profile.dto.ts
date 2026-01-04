import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Irina Shayk' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'irina@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '01700000000' })
    @IsOptional()
    @IsString()
    @Matches(/^01[3-9]\d{8}$/, { message: 'Invalid mobile number format' })
    mobile?: string;
}
