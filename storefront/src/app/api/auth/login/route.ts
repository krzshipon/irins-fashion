import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Pass app=storefront to get the storefront-specific cookie
        const response = await fetch(`${API_URL}/auth/login?app=storefront`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.message || 'Login failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        const setCookieHeader = response.headers.get('set-cookie');

        // Proxy the response and forward cookies
        const nextResponse = NextResponse.json(data);

        if (setCookieHeader) {
            nextResponse.headers.set('Set-Cookie', setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
