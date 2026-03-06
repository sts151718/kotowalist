import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/setup';
import type { AuthClaims } from '@/lib/supabase/types/auth';
import { useLoaderData } from 'react-router';
import type { AuthLoaderData } from '@/routes/loader/authClaimsLoader';

export const useAuthState = () => {
  const { claims } = useLoaderData<AuthLoaderData>();
  const [currentClaims, setCurrentClaims] = useState<AuthClaims | null>(claims);
  const [isAuthenticated, setIsAuthenticated] = useState(claims?.data !== null && claims?.error === null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED': {
          const newClaims = await supabase.auth.getClaims();
          setCurrentClaims(newClaims);
          setIsAuthenticated(newClaims.data !== null && newClaims.error === null);
          break;
        }
        case 'SIGNED_OUT':
          setCurrentClaims(null);
          setIsAuthenticated(false);
          break;
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { currentClaims, isAuthenticated };
};
