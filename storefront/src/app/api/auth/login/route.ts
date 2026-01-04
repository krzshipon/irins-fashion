import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock user data - in production, this would come from your backend
const MOCK_USER = {
    id: 'usr_123456',
    mobile: '01700000000',
    email: 'irina@example.com',
    name: 'Irina Shayk',
    role: 'CUSTOMER',
    avatarUrl: 'https://ui-avatars.com/api/?name=Irina+Shayk&background=1B4D3E&color=fff',
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mobile } = body;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validate mobile format
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(mobile)) {
            return NextResponse.json(
                { error: 'Invalid mobile number format' },
                { status: 400 }
            );
        }

        // Generate mock token (in production, this comes from your auth backend)
        const token = `jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        // Determine user data based on mobile
        const user = mobile === '01700000000'
            ? MOCK_USER
            : { ...MOCK_USER, mobile, name: 'New User', id: `usr_${Date.now()}` };

        // Set HttpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        // Also store user ID in a separate cookie for quick lookups
        cookieStore.set('user_id', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        // Return user data (without token - token is in HttpOnly cookie)
        return NextResponse.json({ user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
