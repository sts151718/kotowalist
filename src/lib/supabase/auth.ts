import type {
  AuthChangeEvent,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  Session,
} from '@supabase/supabase-js';
import { supabase } from './setup';

export const fetchClaims = () => supabase.auth.getClaims();

export const signIn = (credentials: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(credentials);

export const signUp = (credentials: SignUpWithPasswordCredentials) => supabase.auth.signUp(credentials);

export const signOut = () =>
  supabase.auth.signOut({
    scope: 'local',
  });

export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) =>
  supabase.auth.onAuthStateChange(callback);
