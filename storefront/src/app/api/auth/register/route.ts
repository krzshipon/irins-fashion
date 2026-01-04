import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, mobile, password } = body;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Validate inputs
        if (!name || !mobile || !password) {
            return NextResponse.json(
                { error: 'Name, mobile, and password are required' },
                { status: 400 }
            );
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(mobile)) {
            return NextResponse.json(
                { error: 'Invalid mobile number format' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Generate mock token and user
        const token = `jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const user = {
            id: `usr_${Date.now()}`,
            mobile,
            name,
            role: 'CUSTOMER',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B4D3E&color=fff`,
        };

        // Set HttpOnly cookies
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        cookieStore.set('user_id', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}
