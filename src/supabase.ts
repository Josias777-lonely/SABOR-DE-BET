import { createClient } from '@supabase/supabase-js';

// User credentials provided for the Supabase project
const env = (import.meta as any).env || {};
const SUPABASE_URL = (env.VITE_SUPABASE_URL || 'https://teqwiytyrqoajfataqcj.supabase.co').replace(/\/rest\/v1\/?$/, '');
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DkbyDnObNHcs6v6av8PxwQ_lnFPt2uQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Interface matching the User schema
export interface SupabaseUser {
  username: string;
  phone: string;
  email: string;
  password: string;
  balance: number;
  updated_at?: string;
}

// Error logger for cleaner client-side telemetry
export function handleSupabaseError(error: any, operation: string) {
  console.error(`[Supabase Error] Event: ${operation}`, error);
  throw new Error(error?.message || JSON.stringify(error));
}
