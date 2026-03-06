import type { AuthClaims } from '@/lib/supabase/types/auth';
import { supabase } from '@/lib/supabase/setup';

export type AuthLoaderData = {
  claims: AuthClaims;
};

export const authLoader = async (): Promise<AuthLoaderData> => {
  const claims = await supabase.auth.getClaims();

  return { claims };
};
