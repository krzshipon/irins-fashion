import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request && request.cookies) {
            // Determine priority based on route AND origin/referer
            const url = request.url;
            const headers = request.headers || {};
            const origin = headers.origin as string;
            const referer = headers.referer as string;

            // Check if it's an admin route or coming from admin app (localhost:3002)
            const isAdminRoute = url?.includes('/admin');
            const isAdminOrigin =
              (origin && (origin.includes(':3002') || origin.includes('admin'))) ||
              (referer && (referer.includes(':3002') || referer.includes('/admin')));

            if (isAdminRoute || isAdminOrigin) {
              return (
                request.cookies['admin_token'] ||
                request.cookies['storefront_token_v2']
              );
            }

            // For storefront routes, prioritize storefront token
            return (
              request.cookies['storefront_token_v2'] ||
              request.cookies['admin_token']
            );
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, mobile: payload.mobile, role: payload.role };
  }
}
