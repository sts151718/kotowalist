import type { supabase } from '../setup';

export type AuthClaims = Awaited<ReturnType<typeof supabase.auth.getClaims>>;
