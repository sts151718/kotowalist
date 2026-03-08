import { signUp } from '@/lib/supabase/auth';
import { redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';

export type SignUpError = {
  isError: true;
};

type SignupActionReturn = SignUpError | Response;

export const signUpAction: ActionFunction<SignupActionReturn> = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const user_name = formData.get('user_name');

  const { error } = await signUp({
    email: typeof email === 'string' ? email : '',
    password: typeof password === 'string' ? password : '',
    options: {
      data: {
        user_name,
      },
    },
  });

  if (error) {
    return { isError: true };
  }

  return redirect('/');
};
