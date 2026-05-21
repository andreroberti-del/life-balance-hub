// This file mirrors the new project's Supabase client.
// Hardcoded fallbacks keep deploys working when env vars are not configured.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_URL = 'https://eacwmqsoybgvgbtrvumq.supabase.co';
const FALLBACK_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhY3dtcXNveWJndmdidHJ2dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjE0NjEsImV4cCI6MjA5NDg5NzQ2MX0.EkY9zo9thpFlIaX29hqtdKgBFV9aXygwArbxekQSr1g';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  FALLBACK_ANON;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
