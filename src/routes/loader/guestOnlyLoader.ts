import { supabase } from '@/lib/supabase/setup';
import { redirect } from 'react-router';

export const guestOnlyLoader = async () => {
  const claims = await supabase.auth.getClaims();
  const isAuthenticated = claims.data !== null && claims.error === null;

  if (isAuthenticated) {
    throw redirect('/');
  }

  return null;
};
