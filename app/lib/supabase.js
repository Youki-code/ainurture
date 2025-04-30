import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iqmlslnuiswowejwpxzi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxzbG51aXN3b3dlandweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MjE5MjMsImV4cCI6MjA1NzQ5NzkyM30.q_N9iNFY_vV0yyDUgxT8Ah2xyD5rn364upnaUsZ-gKY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
