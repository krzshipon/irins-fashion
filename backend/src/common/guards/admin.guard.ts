import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN'];

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromCookie(request);

        if (!token) {
            throw new UnauthorizedException('Authentication required');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
            });

            // Attach user to request
            request['user'] = {
                id: payload.sub,
                mobile: payload.mobile,
                role: payload.role,
            };

            // Check admin role
            if (!payload.role || !ADMIN_ROLES.includes(payload.role)) {
                throw new ForbiddenException('Admin privileges required');
            }

            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.['admin_token'];
    }
}
