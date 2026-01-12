const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AdminUser {
    id: string;
    name: string;
    email?: string;
    mobile: string;
    role: string;
    isActive: boolean;
    ordersCount: number;
    totalSpent: number;
    createdAt: string;
    lastLogin?: string;
}

export interface UsersResponse {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
}

export const usersService = {
    async getAll(filters?: {
        role?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<UsersResponse> {
        const params = new URLSearchParams();
        if (filters?.role) params.set('role', filters.role);
        if (filters?.search) params.set('search', filters.search);
        if (filters?.page) params.set('page', filters.page.toString());
        if (filters?.limit) params.set('limit', filters.limit.toString());

        const response = await fetch(`${API_URL}/admin/users?${params}`, {
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const result = data.data || data;

        return {
            users: result.users,
            total: result.total,
            page: result.page,
            totalPages: result.totalPages
        };
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }
    },

    async update(id: string, data: any): Promise<AdminUser> {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
        const resData = await response.json();
        return resData.data || resData;
    },

    async updateRole(id: string, role: string): Promise<AdminUser> {
        const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ role }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user role');
        }
        const resData = await response.json();
        return resData.data || resData;
    },

    async updateStatus(id: string, isActive: boolean): Promise<AdminUser> {
        // Mock method until DB supports isActive
        await new Promise(r => setTimeout(r, 500));
        return { id, isActive } as any;
    }
};
