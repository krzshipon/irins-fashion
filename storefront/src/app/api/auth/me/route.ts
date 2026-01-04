import { NextResponse } from 'next/server';
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

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token');
        const userId = cookieStore.get('user_id');

        // Check if token exists
        if (!token?.value) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // In production, validate token with your backend and fetch user data
        // For now, return mock user based on stored user_id
        const user = userId?.value === 'usr_123456'
            ? MOCK_USER
            : { ...MOCK_USER, id: userId?.value || 'usr_unknown' };

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Failed to get profile' },
            { status: 500 }
        );
    }
}
