import { supabase } from '@/lib/supabase/setup';
import { redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';

export type SignInError = {
  isError: true;
  message: string;
};

type SignupActionReturn = SignInError | Response;

export const signInAction: ActionFunction<SignupActionReturn> = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const { error } = await supabase.auth.signInWithPassword({
    email: typeof email === 'string' ? email : '',
    password: typeof password === 'string' ? password : '',
  });

  if (error) {
    const message =
      error.code === 'invalid_credentials'
        ? 'メールアドレスもしくはパスワードが間違っています'
        : '予期せぬエラーが発生しました';

    return { isError: true, message };
  }

  return redirect('/');
};
