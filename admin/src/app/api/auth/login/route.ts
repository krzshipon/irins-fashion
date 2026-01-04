import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Transform 'identifier' to 'mobile' if necessary for backend compatibility
        // Backend accepts both mobile and email (checks for @ symbol)
        const payload = {
            mobile: body.identifier || body.mobile,
            password: body.password
        };

        // Pass app=admin to get the admin-specific cookie
        const response = await fetch(`${API_URL}/auth/login?app=admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.message || 'Login failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Get the set-cookie header from backend
        const setCookieHeader = response.headers.get('set-cookie');

        // Proxy the response and forward cookies (same as storefront)
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
