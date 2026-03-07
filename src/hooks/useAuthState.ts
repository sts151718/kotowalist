import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/setup';
import type { AuthClaims } from '@/lib/supabase/types/auth';
import { useLoaderData } from 'react-router';
import type { AuthLoaderData } from '@/routes/loader/authLoader';
import { fetchUserByAuthId } from '@/lib/supabase/users';
import { useAuthUserStore } from '@/store/useAuthUserStore';

export const useAuthState = () => {
  const { claims, authUser: initialAuthUser } = useLoaderData<AuthLoaderData>();

  const [currentClaims, setCurrentClaims] = useState<AuthClaims | null>(claims);
  const [isAuthenticated, setIsAuthenticated] = useState(claims?.data !== null && claims?.error === null);

  const storeAuthUser = useAuthUserStore((state) => state.user);
  const setUser = useAuthUserStore((state) => state.setUser);
  const unsetUser = useAuthUserStore((state) => state.unsetUser);

  useEffect(() => {
    setUser(initialAuthUser);
  }, [initialAuthUser, setUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED': {
          const newClaims = await supabase.auth.getClaims();
          setCurrentClaims(newClaims);

          const isLoggedIn = newClaims.data !== null && newClaims.error === null;
          setIsAuthenticated(isLoggedIn);

          if (!isLoggedIn || !session?.user.id) {
            unsetUser();
            break;
          }

          try {
            const authUser = await fetchUserByAuthId(session.user.id);
            setUser(authUser);
          } catch {
            unsetUser();
          }
          break;
        }
        case 'SIGNED_OUT':
          setCurrentClaims(null);
          setIsAuthenticated(false);
          unsetUser();
          break;
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, unsetUser]);

  return { currentClaims, isAuthenticated, authUser: storeAuthUser ?? initialAuthUser };
};
