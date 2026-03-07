import type { AuthClaims } from '@/lib/supabase/types/auth';
import type { User } from '@/domain/User';
import { supabase } from '@/lib/supabase/setup';
import { fetchUserByAuthId } from '@/lib/supabase/users';

export type AuthLoaderData = {
  claims: AuthClaims;
  authUser: User | null;
};

export const authLoader = async (): Promise<AuthLoaderData> => {
  const claims = await supabase.auth.getClaims();
  const authId = claims.data?.claims?.sub;

  if (!authId) {
    return { claims, authUser: null };
  }

  const authUser = await fetchUserByAuthId(authId);

  return { claims, authUser };
};
