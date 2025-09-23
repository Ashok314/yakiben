import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
      console.error('Error fetching data from Supabase public.users table:', error);
      return false;
    }

    if (data && data.length > 0) {
      console.log('Connection successful. Sample data from public.users:', data);
    } else {
      console.log('Connection successful, but no data found in the public.users table.');
    }

    return true;
  } catch (err) {
    console.error('Unexpected error during Supabase connection test:', err);
    return false;
  }
}

testSupabaseConnection()