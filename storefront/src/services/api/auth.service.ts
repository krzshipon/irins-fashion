import { User, Address } from './types';

// Mock User Data
const MOCK_USER: User = {
    id: 'usr_123456',
    mobile: '01700000000',
    email: 'irina@example.com',
    name: 'Irina Shayk',
    role: 'CUSTOMER',
    avatarUrl: 'https://ui-avatars.com/api/?name=Irina+Shayk&background=1B4D3E&color=fff',
};

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
    async login(mobile: string): Promise<{ user: User; token: string }> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let response;
        if (mobile === '01700000000') {
            response = {
                user: MOCK_USER,
                token: 'mock_jwt_token_xyz',
            };
        } else {
            // Auto-register simulation for new numbers (as per requirement)
            response = {
                user: { ...MOCK_USER, mobile, name: 'New User' },
                token: 'mock_jwt_token_new',
            };
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('mock_auth_token', response.token);
        }

        return response;
    },

    async logout(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mock_auth_token');
        }
    },

    async getProfile(): Promise<User> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('mock_auth_token');
            if (!token) {
                throw new Error('Unauthorized');
            }
        }

        return MOCK_USER;
    },

    async getAddresses(): Promise<Address[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_ADDRESSES;
    },

    async register(data: { name: string; mobile: string; password: string }): Promise<{ user: User; token: string }> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Simulate registration - create new user
        const newUser: User = {
            id: `usr_${Date.now()}`,
            mobile: data.mobile,
            name: data.name,
            role: 'CUSTOMER',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1B4D3E&color=fff`,
        };

        const response = {
            user: newUser,
            token: `mock_jwt_token_${Date.now()}`,
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('mock_auth_token', response.token);
        }

        return response;
    },

    // Forgot Password Flow
    async requestPasswordReset(mobile: string): Promise<{ success: boolean; message: string }> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate checking if account exists
        // For demo: accept any valid BD mobile number
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(mobile)) {
            throw new Error('Invalid mobile number format');
        }

        // Simulate sending OTP (in production, this would send an SMS)
        console.log(`[MOCK] OTP sent to ${mobile}: 123456`);

        return {
            success: true,
            message: 'OTP sent successfully',
        };
    },

    async verifyOTP(mobile: string, otp: string): Promise<{ success: boolean; resetToken: string }> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock OTP verification - accept "123456" as valid OTP
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

        // Mock password reset
        if (!resetToken || newPassword.length < 6) {
            throw new Error('Invalid request');
        }

        return {
            success: true,
        };
    },
};

