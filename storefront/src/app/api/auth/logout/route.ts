import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Clear auth cookies
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
        cookieStore.delete('user_id');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
