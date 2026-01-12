import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  UnauthorizedException,
  Patch,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

// Helper to determine cookie name based on app type
function getCookieName(appType?: string): string {
  if (appType === 'admin') return 'admin_token';
  return 'storefront_token_v2';
}

// Roles allowed to access admin panel (must match Prisma enum values)
const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN'];

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in user' })
  @ApiBody({ type: LoginDto })
  @ApiQuery({
    name: 'app',
    required: false,
    description: 'App type: admin or storefront',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and cookie set.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient role for admin access.',
  })
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) response: any,
    @Query('app') appType?: string,
  ) {
    // Role-based access control for admin app
    if (appType === 'admin') {
      if (!req.user.role || !ADMIN_ROLES.includes(req.user.role)) {
        throw new ForbiddenException(
          'Access denied. Admin privileges required.',
        );
      }
    }

    const { access_token, user } = await this.authService.login(req.user);
    this.setAuthCookie(response, access_token, appType);
    return { success: true, user };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiQuery({
    name: 'app',
    required: false,
    description: 'App type: admin or storefront',
  })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: any,
    @Query('app') appType?: string,
  ) {
    const user = await this.authService.register(body);

    // Auto-login after registration
    const { access_token } = await this.authService.login(user);
    this.setAuthCookie(response, access_token, appType);

    return { success: true, user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out user' })
  @ApiQuery({
    name: 'app',
    required: false,
    description: 'App type: admin or storefront',
  })
  async logout(
    @Res({ passthrough: true }) response: any,
    @Query('app') appType?: string,
  ) {
    const cookieName = getCookieName(appType);

    // Cookie options must match those used in login
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    response.clearCookie(cookieName, cookieOptions);
    return { success: true };
  }

  private setAuthCookie(response: Response, token: string, appType?: string) {
    const cookieName = getCookieName(appType);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Clear any existing cookie first
    response.clearCookie(cookieName, cookieOptions);

    // Set HttpOnly Cookie
    response.cookie(cookieName, token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findOne({ id: req.user.id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return { user: result };
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
