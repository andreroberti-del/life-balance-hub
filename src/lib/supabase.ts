import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yrlwxqjvisjulcnilcyb.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybHd4cWp2aXNqdWxjbmlsY3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzM1ODYsImV4cCI6MjA4OTQwOTU4Nn0.mBxs_v-9aVrURbJ-PbSsP15r-jD-kc9xfgEx4pk77b8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
