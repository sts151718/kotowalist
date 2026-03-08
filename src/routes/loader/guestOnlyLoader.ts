import { fetchClaims } from '@/lib/supabase/auth';
import { redirect } from 'react-router';

export const guestOnlyLoader = async () => {
  const claims = await fetchClaims();
  const isAuthenticated = claims.data !== null && claims.error === null;

  if (isAuthenticated) {
    throw redirect('/');
  }

  return null;
};
