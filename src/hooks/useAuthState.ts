import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/setup';
import { useLoaderData } from 'react-router';
import type { AuthLoaderData } from '@/routes/loader/authLoader';
import { fetchUserByAuthId } from '@/lib/supabase/users';
import { useAuthUserStore } from '@/store/useAuthUserStore';

const checkAuthenticated = (claims: AuthLoaderData['claims']) => claims?.data !== null && claims?.error === null;

export const useAuthState = () => {
  const { claims, authUser: initialAuthUser } = useLoaderData<AuthLoaderData>();
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthenticated(claims));

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

          const isNewAuthenticated = checkAuthenticated(newClaims);
          setIsAuthenticated(isNewAuthenticated);

          if (!isNewAuthenticated || !session?.user.id) {
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
          setIsAuthenticated(false);
          unsetUser();
          break;
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, unsetUser]);

  return { isAuthenticated, authUser: storeAuthUser ?? initialAuthUser };
};
