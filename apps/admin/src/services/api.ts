export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbwsNcaQZ75QLBKhRGj67IsMGElrqWjwrO5IUsmP5PYnDu1lFU7ePUMyF0oOXjv8pcoA/exec';

interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    error?: string;
}

export async function callAPI<T = any>(action: string, data: any = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('yakiben-admin-token');

    // Inject auth token if available
    if (token) {
        data.authToken = token;
    }

    console.log(`[API] Calling ${action} at ${API_BASE_URL}`);

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
        console.log(`[API] ${action} response:`, result);
        return result;
    } catch (error) {
        console.error(`[API] ${action} error:`, error);
        return { success: false, data: null as any, error: String(error) };
    }
}
