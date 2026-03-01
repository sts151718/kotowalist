import { Button, Card, Field, Fieldset, Heading, Input, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { Form } from 'react-router';
import { PrimaryLink } from '../atoms/link/PrimaryLink';

export const Signup: FC = () => {
  // const actionData = useActionData<{ signupError?: boolean }>();

  return (
    <MainContainer data-testid="sign-up-page">
      <Card.Root textAlign="center">
        <Card.Header>
          <Heading as="h2">新規登録</Heading>
        </Card.Header>
        <Card.Body>
          <Form method="post">
            <Fieldset.Root mb={6}>
              <Fieldset.Content>
                <Field.Root>
                  <Field.Label>ユーザー名</Field.Label>
                  <Input placeholder="user_name" name="user_name" />
                  <Field.HelperText>英数字アンダーバー(_)3文字以上50文字以下</Field.HelperText>
                </Field.Root>
                <Field.Root>
                  <Field.Label>メールアドレス</Field.Label>
                  <Input placeholder="example.example.com" type="email" name="email" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>パスワード</Field.Label>
                  <Input placeholder="••••••••" type="password" name="password" />
                  <Field.HelperText>英数字記号8文字以上</Field.HelperText>
                </Field.Root>
                <Field.Root>
                  <Field.Label>パスワード（確認） </Field.Label>
                  <Input placeholder="••••••••" type="password" name="password_confirm" />
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>

            <Button w="full" colorPalette="blue" mb={4} type="submit">
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
