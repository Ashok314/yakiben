// import { useAuthStore } from '../stores/auth'; // Removed circular dependency

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbwe8KLexn483LNVGM9orL0GQtK3eqh3N_KsHxTX62xb81Hghe3mGuyBJBo_W2_YDaeS/exec';

interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    error?: string;
}

export async function callAPI<T = any>(action: string, data: any = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('yakiben-auth-token');

    // Inject auth token if available
    if (token) {
        data.authToken = token;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ action, data }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`API Error (${action}):`, error);
        return { success: false, data: null as any, error: String(error) };
    }
}
