import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
    try {
        // Pass app=admin to clear the correct cookie
        const response = await fetch(`${API_URL}/auth/logout?app=admin`, {
            method: 'POST',
        });

        const data = await response.json();

        // Forward the Set-Cookie header to clear the cookie
        const setCookieHeader = response.headers.get('set-cookie');

        const nextResponse = NextResponse.json(data);

        if (setCookieHeader) {
            nextResponse.headers.set('Set-Cookie', setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
