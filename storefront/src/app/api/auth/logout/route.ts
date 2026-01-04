import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
        });

        const nextResponse = NextResponse.json({ success: true });

        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            nextResponse.headers.set('Set-Cookie', setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
