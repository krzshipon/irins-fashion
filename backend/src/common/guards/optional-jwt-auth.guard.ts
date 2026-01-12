import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Optional JWT Auth Guard - extracts user from JWT if present but doesn't reject request
 * Use this for endpoints that support both guest and authenticated users
 */
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Try to get token from cookies (check both admin and storefront tokens)
        const token = request.cookies?.['storefront_token_v2'] || request.cookies?.['admin_token'];

        if (token) {
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });
                // Attach user to request
                request['user'] = {
                    id: payload.sub,
                    mobile: payload.mobile,
                    role: payload.role,
                };
            } catch (error) {
                // Token invalid/expired - continue as guest
                request['user'] = undefined;
            }
        }

        // Always allow the request to proceed (it's optional)
        return true;
    }
}
