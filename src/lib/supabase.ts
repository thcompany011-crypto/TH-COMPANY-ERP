import { createClient } from "@supabase/supabase-js";

// These are public frontend settings. Never put a Supabase secret/service_role key here.
// Environment variables override these defaults when configured by the deployment platform.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://pafazxuzlfvfrtcznnid.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "sb_publishable_kEwyLb9giuEhEztwaW_mCg_6D9-1Vsk";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
