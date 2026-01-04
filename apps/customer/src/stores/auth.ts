import { ref, computed } from 'vue';
import { callAPI } from '../services/api';

interface User {
    name: string;
    email: string;
    picture: string;
}

const token = ref(localStorage.getItem('yakiben-auth-token') || '');
const user = ref<User | null>(
    localStorage.getItem('yakiben-user')
        ? JSON.parse(localStorage.getItem('yakiben-user')!)
        : null
);

export const useAuthStore = () => {
    const isAuthenticated = computed(() => !!token.value);

    async function login(credential: string) {
        const result = await callAPI('login', { credential });

        if (result.success) {
            token.value = result.data.token;
            user.value = result.data.user;

            localStorage.setItem('yakiben-auth-token', result.data.token);
            localStorage.setItem('yakiben-user', JSON.stringify(result.data.user));
            return { success: true };
        } else {
            console.error('Login failed:', result.error);
            return { success: false, error: result.error };
        }
    }

    function logout() {
        token.value = '';
        user.value = null;
        localStorage.removeItem('yakiben-auth-token');
        localStorage.removeItem('yakiben-user');

        // Optional: Refresh page to clear any other state
        window.location.reload();
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout
    };
};
