import { User, Address } from './types';

// Mock addresses (still used for profile data)
const MOCK_ADDRESSES: Address[] = [
    {
        id: 'addr_1',
        label: 'Home',
        recipientName: 'Irina Shayk',
        street: 'House 12, Road 5, Block A',
        city: 'Dhaka',
        division: 'Dhaka',
        postalCode: '1209',
        phone: '01700000000',
        isDefault: true,
    },
    {
        id: 'addr_2',
        label: 'Work',
        recipientName: 'Irina Shayk',
        street: 'Level 12, Gulshan Center Point',
        city: 'Dhaka',
        division: 'Dhaka',
        postalCode: '1212',
        phone: '01700000000',
        isDefault: false,
    },
];

export const authService = {
    async login(mobile: string): Promise<{ user: User }> {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    async logout(): Promise<void> {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    },

    async getProfile(): Promise<User> {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data.user;
    },

    async getAddresses(): Promise<Address[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_ADDRESSES;
    },

    async updateProfile(data: { name?: string; email?: string; mobile?: string }): Promise<User> {
        // In production, this would call a PATCH /api/auth/profile endpoint
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Return updated user (mock)
        return {
            id: 'usr_123456',
            mobile: data.mobile || '01700000000',
            email: data.email,
            name: data.name || 'User',
            role: 'CUSTOMER',
            avatarUrl: data.name
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1B4D3E&color=fff`
                : undefined,
        };
    },

    async register(data: { name: string; mobile: string; password: string }): Promise<{ user: User }> {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    // Forgot Password Flow (these still work the same - no token storage needed)
    async requestPasswordReset(mobile: string): Promise<{ success: boolean; message: string }> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(mobile)) {
            throw new Error('Invalid mobile number format');
        }

        console.log(`[MOCK] OTP sent to ${mobile}: 123456`);

        return {
            success: true,
            message: 'OTP sent successfully',
        };
    },

    async verifyOTP(mobile: string, otp: string): Promise<{ success: boolean; resetToken: string }> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (otp === '123456') {
            return {
                success: true,
                resetToken: `reset_token_${Date.now()}`,
            };
        }

        throw new Error('Invalid OTP. Please try again.');
    },

    async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean }> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!resetToken || newPassword.length < 6) {
            throw new Error('Invalid request');
        }

        return {
            success: true,
        };
    },

    // Address Management (Mock)
    async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newAddress = {
            ...address,
            id: `addr_${Date.now()}`,
        };
        // In a real app, we would push to MOCK_ADDRESSES or backend
        // MOCK_ADDRESSES.push(newAddress); 
        return newAddress;
    },

    async updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Find and update mock address
        const index = MOCK_ADDRESSES.findIndex(a => a.id === id);
        if (index !== -1) {
            // MOCK_ADDRESSES[index] = { ...MOCK_ADDRESSES[index], ...updates };
            return { ...MOCK_ADDRESSES[index], ...updates };
        }
        throw new Error('Address not found');
    },

    async deleteAddress(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        // MOCK_ADDRESSES = MOCK_ADDRESSES.filter(a => a.id !== id);
    },
};
