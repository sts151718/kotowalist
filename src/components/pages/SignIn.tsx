import { Field, Fieldset, Input, Text } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { PrimaryLink } from '../atoms/link/PrimaryLink';
import { AuthFormCard } from '../organisms/AuthFormCard';

const signInSchema = z.object({
  email: z.email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInSchema>;

export const SignIn: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInForm>({
    mode: 'onBlur',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInForm> = () => {
    setIsLoading(true);
    // submit(data, { method: 'post' });
  };

  return (
    <MainContainer testId="sign-in-page">
      <AuthFormCard title="ログイン" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root mb={6}>
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>メールアドレス</Field.Label>
              <Input placeholder="example.example.com" type="email" {...register('email')} />
            </Field.Root>
            <Field.Root invalid={!!errors.password?.message}>
              <Field.Label>パスワード</Field.Label>
              <Input placeholder="••••••••" type="password" {...register('password')} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>
          <Fieldset.ErrorText>ログインに失敗しました。</Fieldset.ErrorText>
        </Fieldset.Root>

        <PrimaryButton w="full" mb={4} type="submit" disabled={!isValid || isLoading} loading={isLoading}>
          ログイン
        </PrimaryButton>
        <Text fontSize="sm">
          アカウントをお持ちでない方は
          <PrimaryLink to="/sign-up">新規登録</PrimaryLink>
        </Text>
      </AuthFormCard>
    </MainContainer>
  );
};
