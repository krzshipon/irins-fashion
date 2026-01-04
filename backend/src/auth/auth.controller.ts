import { Controller, Request, Post, UseGuards, Body, Get, Res, UnauthorizedException, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Log in user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'User successfully logged in and cookie set.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async login(@Request() req: any, @Res({ passthrough: true }) response: any) {
        const { access_token, user } = await this.authService.login(req.user);

        // Set HttpOnly Cookie
        response.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        });

        return { success: true, user };
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Log out user' })
    async logout(@Res({ passthrough: true }) response: any) {
        response.clearCookie('token');
        return { success: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req: any) {
        return { user: req.user };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiBody({ type: UpdateProfileDto })
    async updateProfile(@Request() req: any, @Body() body: UpdateProfileDto) {
        // Only allow updating specific fields
        const { name, email, mobile } = body;

        // Use UsersService to update
        // Note: We need to inject UsersService here, but currently only AuthService is injected.
        // Option 1: Add updateProfile to AuthService (cleaner architecture)
        // Option 2: Inject UsersService here.
        // Let's go with Option 1: Delegate to AuthService.
        return this.authService.updateProfile(req.user.id, { name, email, mobile });
    }
}
