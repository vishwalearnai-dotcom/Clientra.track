import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables (.env.local or production build env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If credentials are not yet supplied, log a reminder and provide fallback
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ [Clientra Track] Supabase credentials not found. Operating with local fallback state. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to synchronize live DB.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
