import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: '01700000000', description: 'User mobile number' })
    @IsString()
    mobile: string;

    @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'john@example.com', description: 'User email address' })
    @IsOptional()
    @IsEmail()
    email?: string;
}
