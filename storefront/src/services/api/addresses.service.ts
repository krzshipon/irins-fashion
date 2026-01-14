import { Address } from './types';

// Use proxy for client-side requests to ensure cookies are sent
const API_URL = '/api/backend';

export const addressesService = {
    async getAll(): Promise<Address[]> {
        const response = await fetch(`${API_URL}/addresses`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || []);
    },

    async create(address: Omit<Address, 'id'>): Promise<Address> {
        const response = await fetch(`${API_URL}/addresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create address');
        }

        const data = await response.json();
        return data.data || data;
    },

    async update(id: string, updates: Partial<Address>): Promise<Address> {
        const response = await fetch(`${API_URL}/addresses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update address');
        }

        const data = await response.json();
        return data.data || data;
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/addresses/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete address');
        }
    },
};
