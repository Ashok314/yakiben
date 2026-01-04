import { callAPI } from '../services/api';
import type { User } from '../types/types';

export const usersApi = {
    async getUsers(): Promise<User[]> {
        const res = await callAPI<User[]>('getUsers');
        if (res.success && res.data) {
            return res.data;
        }
        return [];
    }
};
