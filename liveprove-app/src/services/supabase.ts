import { createClient } from '@supabase/supabase-js';

export type Report = {
  id: string;
  created_at: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string | null;
  tag: 'Emergency' | 'Suspicious' | 'Rule Breaking' | 'Wanted Person';
  is_anonymous: boolean;
  latitude: number;
  longitude: number;
  location_name: string;
  incident_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  authority_needed: string;
  ai_summary: string;
  confidence: number;
  status: 'pending' | 'verified' | 'rejected';
  country_code: string;
  state: string;
  city: string;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

