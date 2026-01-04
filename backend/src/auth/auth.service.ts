
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(mobile: string, pass: string): Promise<any> {
        const user = await this.usersService.findByMobile(mobile);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { mobile: user.mobile, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async register(data: any) {
        // Check if user exists
        const existing = await this.usersService.findByMobile(data.mobile);
        if (existing) {
            throw new UnauthorizedException('User already exists');
        }
        const user = await this.usersService.createUser(data);
        const { password, ...result } = user;
        return result;
    }
}
