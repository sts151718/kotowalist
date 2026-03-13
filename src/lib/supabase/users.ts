import { User } from '@/domain/User';
import { supabase } from './setup';
import type { Tables } from './schema';

export const existsEmail = async (email: string): Promise<boolean> => {
  if (!email) return false;

  const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('email', email);

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  return count !== null && count >= 1;
};

export const existsUserName = async (userName: string): Promise<boolean> => {
  if (!userName) return false;

  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_name', userName);

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  return count !== null && count >= 1;
};

export const fetchUserByAuthId = async (authId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .limit(1)
    .overrideTypes<Array<Tables<'users'>>>();

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  const userData = data[0];

  const authUser = new User(userData.id, userData.user_name);

  return authUser;
};
