import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

console.log('[SupabaseClient] Initializing with URL:', supabaseUrl);
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
