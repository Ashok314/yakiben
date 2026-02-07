
import { ref, computed } from 'vue';
import { supabase } from '@yakiben/supabase';

const token = ref<string | null>(null);
const user = ref<any>(null);

// Initialize and listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        token.value = session.access_token;
        // Normalize user object with common fields
        user.value = {
            ...session.user,
            picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
        };
    } else {
        token.value = null;
        user.value = null;
    }
});


export const useAuthStore = () => {
    const isAuthenticated = computed(() => !!token.value);

    async function loginWithGoogle(credential: string) {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credential
        });
        if (error) {
            console.error('Google login failed:', error.message);
            return { success: false, error: error.message };
        }
        return { success: true };
    }

    async function signInAnonymously() {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.error('Anonymous sign-in failed:', error.message);
            return { success: false, error: error.message };
        }
        token.value = data.session?.access_token || null;
        user.value = data.user;
        return { success: true };
    }

    async function refreshSession() {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            token.value = data.session.access_token;
            user.value = data.session.user;
        } else {
            token.value = null;
            user.value = null;
        }
    }

    async function logout() {
        await supabase.auth.signOut();
        token.value = null;
        user.value = null;
        window.location.reload();
    }

    return {
        token,
        user,
        isAuthenticated,
        loginWithGoogle,
        signInAnonymously,
        refreshSession,
        logout
    };
};
