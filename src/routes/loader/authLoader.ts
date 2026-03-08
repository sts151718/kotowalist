import type { AuthClaims } from '@/lib/supabase/types/auth';
import type { User } from '@/domain/User';
import { fetchClaims } from '@/lib/supabase/auth';
import { fetchUserByAuthId } from '@/lib/supabase/users';

export type AuthLoaderData = {
  claims: AuthClaims;
  authUser: User | null;
};

export const authLoader = async (): Promise<AuthLoaderData> => {
  const claims = await fetchClaims();
  const authId = claims.data?.claims?.sub;

  if (!authId) {
    return { claims, authUser: null };
  }

  const authUser = await fetchUserByAuthId(authId);

  return { claims, authUser };
};
