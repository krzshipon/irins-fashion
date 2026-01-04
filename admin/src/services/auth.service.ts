export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: 'ADMIN' | 'CUSTOMER';
    avatarUrl?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authService = {
    async login(identifier: string, password: string): Promise<{ user: User }> {
        // We'll use the same proxy pattern as storefront, or hit backend directly if we configure CORS correctly.
        // For distinct session management, using Next.js API routes as proxy is safer for cookies.
        // So we need to create /api/auth/login in admin app as well.

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }), // Backend now accepts 'identifier' (email or mobile) but DTO might still say mobile? 
            // Wait, backend AuthController.login uses req.user from LocalStrategy.
            // LocalStrategy uses AuthService.validateUser(identifier, password).
            // But the LoginDto in backend might still enforce 'mobile'.
            // Let's check LoginDto.
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        return data.data || data;
    },

    async logout(): Promise<void> {
        await fetch('/api/auth/logout', { method: 'POST' });
    },

    async getProfile(): Promise<User> {
        const response = await fetch('/api/auth/me');
        if (!response.ok) throw new Error('Unauthorized');
        const data = await response.json();
        const user = data.data?.user || data.user || data;

        if (user.role !== 'ADMIN') {
            throw new Error('Access denied');
        }
        return user;
    }
};
