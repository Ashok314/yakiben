import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserRole } from '../types/types'
import { USER_ROLES } from '../constants/auth'
import { supabase } from '@yakiben/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isInitialLoading = ref(true)

  // Initialize and listen to auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[AuthStore] onAuthStateChange event:', event);
    if (session?.user) {
      // Don't fetch profile here to avoid hanging the auth flow
      // Just set basic info from session first
      let role = (session.user.user_metadata?.role as UserRole) || USER_ROLES.STAFF;
      if ((role as string) === 'admin') role = USER_ROLES.MANAGER;

      user.value = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Admin User',
        picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        role
      };
      isAuthenticated.value = true;
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('user');
    }
    isInitialLoading.value = false;
  });

  const loginWithGoogle = async (credential: string) => {
    console.log('[AuthStore] loginWithGoogle called', { credentialLen: credential?.length });
    console.log('[AuthStore] Env Vars:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      HAS_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });
    console.log('[AuthStore] Supabase Client internal url:', (supabase as any)['supabaseUrl']);

    // DIAGNOSTIC START
    console.log('[Diagnostic] 1. Testing Timer (1s)...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[Diagnostic] 2. Timer Works!');

    console.log('[Diagnostic] 3. Testing Fetch to Supabase...');
    try {
      const resp = await fetch((supabase as any)['supabaseUrl'], { method: 'HEAD' });
      console.log('[Diagnostic] 4. Fetch Response:', resp.status);
    } catch (err) {
      console.error('[Diagnostic] 4. Fetch FAILED:', err);
    }
    // DIAGNOSTIC END

    // 1. Sign in with Supabase
    let data, error;
    try {
      console.log('[AuthStore] Calling signInWithIdToken...');

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase signInWithIdToken timed out after 10s')), 10000)
      );

      const signInPromise = supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential
      });

      const result: any = await Promise.race([signInPromise, timeoutPromise]);

      console.log('[AuthStore] signInWithIdToken result:', result);
      data = result.data;
      error = result.error;
    } catch (e: any) {
      console.error('[AuthStore] Exception during signInWithIdToken:', e);
      return { success: false, message: 'Authentication exception: ' + e.message };
    }

    if (error) {
      console.error('[AuthStore] signInWithIdToken error:', error);
      return { success: false, message: error.message };
    }

    console.log('[AuthStore] signInWithIdToken success:', data.user?.id);

    // 2. Check Role
    console.log('[AuthStore] Checking profile role...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, f_name, l_name')
      .eq('id', data.user?.id)
      .single();

    if (profileError) {
      console.error('[AuthStore] Profile fetch error:', profileError);
    }

    if (profile) {
      console.log('[AuthStore] Updating user with DB profile role:', profile.role);
      if (user.value) {
        let role = profile.role as UserRole;
        if ((role as string) === 'admin') role = USER_ROLES.MANAGER;
        user.value.role = role;

        // Optionally update other info if in profile
        if (profile.f_name || profile.l_name) {
          const fName = profile.f_name || '';
          const lName = profile.l_name || '';
          user.value.name = fName === lName ? fName : `${fName} ${lName}`.trim();
        }
        localStorage.setItem('user', JSON.stringify(user.value));
      }
    }

    if (!profile || ![USER_ROLES.MANAGER, USER_ROLES.STAFF, USER_ROLES.DRIVER].includes(profile.role)) {
      console.warn('[AuthStore] Access denied. Role:', profile?.role);
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Access denied. Your account does not have admin privileges.'
      };
    }

    console.log('[AuthStore] Access granted.');
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { success: false, message: error.message };

    // Check if the user has an admin role after logging in
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, f_name, l_name')
      .eq('id', data.user?.id)
      .single();

    if (!profile || !['admin', 'manager', 'staff', 'driver'].includes(profile.role)) {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Access denied. Your account does not have admin privileges.'
      };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (updatedUser: User) => {
    // Only update profile data, auth email/pass is separate
    const { error } = await supabase
      .from('profiles')
      .update({
        f_name: updatedUser.name.split(' ')[0],
        l_name: updatedUser.name.split(' ').slice(1).join(' ')
      })
      .eq('id', updatedUser.id);

    if (!error) {
      user.value = { ...updatedUser };
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  return {
    isInitialLoading,
    user,
    isAuthenticated,
    loginWithGoogle,
    login,
    logout,
    updateUser,
  }
})
