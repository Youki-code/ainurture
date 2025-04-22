import { createClient } from '@supabase/supabase-js';

// Get environment variables
const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return {
      url: 'https://iqmlslnuiswowejwpxzi.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxzbG51aXN3b3dlandweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MjE5MjMsImV4cCI6MjA1NzQ5NzkyM30.q_N9iNFY_vV0yyDUgxT8Ah2xyD5rn364upnaUsZ-gKY'
    };
  }

  return {
    url: supabaseUrl,
    key: supabaseAnonKey
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: sessionStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/email-campaign` : undefined
  }
});

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