import { createClient } from '@supabase/supabase-js';

// Fallback hardcoded com projeto M7 Life Balance Supabase
// Anon key é segura de expor (pública por design, RLS protege os dados)
const FALLBACK_URL = 'https://eacwmqsoybgvgbtrvumq.supabase.co';
const FALLBACK_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhY3dtcXNveWJndmdidHJ2dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjE0NjEsImV4cCI6MjA5NDg5NzQ2MX0.EkY9zo9thpFlIaX29hqtdKgBFV9aXygwArbxekQSr1g';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  FALLBACK_ANON;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
