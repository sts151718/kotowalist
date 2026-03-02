import { Button, Card, Field, Fieldset, Heading, Input, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { Form, useActionData, useSubmit } from 'react-router';
import { PrimaryLink } from '../atoms/link/PrimaryLink';
import type { SignupError } from '@/routes/actions/signupAction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

const signupSchema = z
  .object({
    user_name: z
      .string()
      .min(3, { message: 'ユーザー名は3文字以上で入力してください' })
      .max(20, { message: 'ユーザー名は20文字以内で入力してください' })
      .regex(/^[a-zA-Z_]+$/, { message: 'ユーザー名は英数字とアンダーバーのみ使用可能です' }),
    email: z.email({ message: '有効なメールアドレスを入力してください' }),
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

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup: FC = () => {
  const actionData = useActionData<SignupError>();
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    mode: 'onBlur',
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <MainContainer data-testid="sign-up-page">
      <Card.Root textAlign="center">
        <Card.Header>
          <Heading as="h2">新規登録</Heading>
        </Card.Header>
        <Card.Body>
          <Form method="post" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset.Root mb={6} invalid={actionData?.signupError}>
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

            <Button w="full" colorPalette="blue" mb={4} type="submit" disabled={!isValid}>
              新規登録
            </Button>

            <Text fontSize="sm">
              既にアカウントをお持ちの方は
              <PrimaryLink to="/sign-in">ログイン</PrimaryLink>
            </Text>
          </Form>
        </Card.Body>
      </Card.Root>
    </MainContainer>
  );
};
