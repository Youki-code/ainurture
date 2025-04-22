import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize session from sessionStorage if exists
const initSession = async () => {
  try {
    const existingToken = sessionStorage.getItem('supabase.auth.token');
    if (existingToken) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error initializing session:', error);
        sessionStorage.removeItem('supabase.auth.token');
      }
      return session;
    }
  } catch (error) {
    console.error('Error in initSession:', error);
  }
};

// Call initSession when the module loads
initSession();