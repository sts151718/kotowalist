import { Field, Fieldset, Input, Text } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import { useActionData, useSubmit } from 'react-router';
import type { SignUpError } from '@/routes/actions/signUpAction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { existsEmail, existsUserName } from '@/lib/supabase/users';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { PrimaryLink } from '../atoms/link/PrimaryLink';
import { AuthFormCard } from '../organisms/AuthFormCard';

const signUpSchema = z
  .object({
    user_name: z
      .string()
      .min(3, { message: 'ユーザー名は3文字以上で入力してください' })
      .max(20, { message: 'ユーザー名は20文字以内で入力してください' })
      .regex(/^[a-zA-Z0-9_]+$/, { message: 'ユーザー名は英数字とアンダーバーのみ使用可能です' })
      .refine(async (user_name) => existsUserName(user_name), {
        message: '入力したユーザー名が重複しています。',
      }),
    email: z
      .email({ message: '有効なメールアドレスを入力してください' })
      .refine(async (email) => await existsEmail(email), {
        message: '入力したパスワードが重複しています。',
      }),
    password: z
      .string()
      .min(10, { message: 'パスワードは10文字以上で入力してください' })
      .max(50, { message: 'パスワードは50文字以内で入力してください' })
      .regex(/^[a-zA-Z0-9!@#$%^&*-_]+$/, { message: 'パスワードは英数字と特定の記号（!@#$%^&*-_）のみ使用可能です' }),
    password_confirm: z.string().min(1, { message: 'パスワード（確認）は必須項目です' }),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '入力したパスワードと一致していません。',
    path: ['password_confirm'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export const SignUp: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<SignUpError>();
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({
    mode: 'onBlur',
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpForm> = (data) => {
    setIsLoading(true);
    submit(data, { method: 'post' });
  };

  return (
    <MainContainer testId="sign-up-page">
      <AuthFormCard title="新規登録" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root mb={6} invalid={actionData?.isError}>
          <Fieldset.Content>
            <Field.Root invalid={!!errors.user_name?.message}>
              <Field.Label>ユーザー名</Field.Label>
              <Input placeholder="user_name" {...register('user_name')} />
              <Field.HelperText>3〜20文字（英数字と_が使用可能）</Field.HelperText>
              <Field.ErrorText>{errors.user_name?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.email?.message}>
              <Field.Label>メールアドレス</Field.Label>
              <Input placeholder="example.example.com" type="email" {...register('email')} />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.password?.message}>
              <Field.Label>パスワード</Field.Label>
              <Input placeholder="••••••••" type="password" {...register('password')} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              <Field.HelperText>10〜50文字（英数字と!@#$%^&*-_が使用可能）</Field.HelperText>
            </Field.Root>
            <Field.Root invalid={!!errors.password_confirm?.message}>
              <Field.Label>パスワード（確認） </Field.Label>
              <Input placeholder="••••••••" type="password" {...register('password_confirm')} />
              <Field.ErrorText>{errors.password_confirm?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>
          <Fieldset.ErrorText>ユーザーの登録に失敗しました。</Fieldset.ErrorText>
        </Fieldset.Root>

        <PrimaryButton w="full" mb={4} type="submit" disabled={!isValid || isLoading} loading={isLoading}>
          新規登録
        </PrimaryButton>
        <Text fontSize="sm">
          既にアカウントをお持ちの方は
          <PrimaryLink to="/signin">ログイン</PrimaryLink>
        </Text>
      </AuthFormCard>
    </MainContainer>
  );
};
