import { Field, Fieldset, Input, Text } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { PrimaryLink } from '../atoms/link/PrimaryLink';
import { AuthFormCard } from '../organisms/AuthFormCard';
import { useActionData, useSubmit } from 'react-router';
import type { SignInError } from '@/routes/actions/signInAction';

const signInSchema = z.object({
  email: z.email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(1, 'パスワードは入力必須です'),
});

type SignInForm = z.infer<typeof signInSchema>;

export const SignIn: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const actionData = useActionData<SignInError>();
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInForm>({
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    setIsLoading(true);
    await submit(data, { method: 'post' });
    setIsLoading(false);
  };

  return (
    <MainContainer testId="sign-in-page">
      <AuthFormCard title="ログイン" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root mb={6} invalid={actionData?.isError}>
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>メールアドレス</Field.Label>
              <Input placeholder="example.example.com" type="email" {...register('email')} />
            </Field.Root>
            <Field.Root>
              <Field.Label>パスワード</Field.Label>
              <Input placeholder="••••••••" type="password" {...register('password')} />
            </Field.Root>
          </Fieldset.Content>
          <Fieldset.ErrorText fontSize="sm">{actionData?.message}</Fieldset.ErrorText>
        </Fieldset.Root>

        <PrimaryButton w="full" mb={4} type="submit" disabled={!isValid || isLoading} loading={isLoading}>
          ログイン
        </PrimaryButton>
        <Text fontSize="sm">
          アカウントをお持ちでない方は
          <PrimaryLink to="/signup">新規登録</PrimaryLink>
        </Text>
      </AuthFormCard>
    </MainContainer>
  );
};
