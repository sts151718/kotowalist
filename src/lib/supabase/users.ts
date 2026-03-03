import { supabase } from './setup';

export const existsEmail = async (email: string): Promise<boolean> => {
  if (!email) return false;

  const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('email', email);

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  return count !== null && count < 1;
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

  return count !== null && count < 1;
};
