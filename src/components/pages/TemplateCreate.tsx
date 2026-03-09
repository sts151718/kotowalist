import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { BackLink } from '../molecules/link/BackLink';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Card, Checkbox, Fieldset, Heading, Input, Stack, Textarea } from '@chakra-ui/react';
import { Form } from 'react-router';
import { FormField } from '../molecules/form/FormField';
import { TiptapEditor } from '../molecules/tiptap/TiptapEditor';
import { FiPlus } from 'react-icons/fi';
import { LiaSaveSolid } from 'react-icons/lia';
import { PrimaryButton } from '../atoms/button/PrimaryButton';

export const TemplateCreate: FC = () => {
  return (
    <MainContainer testId="template-create-page">
      <BackLink to="/">一覧へ戻る</BackLink>
      <PrimaryHeading description="断り方のテンプレートを作成して、共有しよう">新規テンプレート作成</PrimaryHeading>
      <Form>
        <Fieldset.Root>
          <Fieldset.Content>
            <Card.Root size="sm" variant="elevated" shadow="xs">
              <Card.Body>
                <FormField label="断りたい状況" required>
                  <Input placeholder="例：上司からの飲み会の誘いを断る" />
                </FormField>
              </Card.Body>
            </Card.Root>
            <Card.Root size="sm" variant="elevated" shadow="xs">
              <Card.Body>
                <FormField label="実際にあった状況">
                  <TiptapEditor placeholder="例：金曜の夕方に突然誘われました" />
                </FormField>
              </Card.Body>
            </Card.Root>
            <Card.Root size="sm" variant="elevated" shadow="xs">
              <Card.Body>
                <FormField label="当時の心境">
                  <TiptapEditor placeholder="例：断りづらくて困りました" />
                </FormField>
              </Card.Body>
            </Card.Root>
            <Card.Root size="sm" variant="elevated" shadow="xs">
              <Card.Body>
                <Heading as="h3" fontSize="sm" mb={2}>
                  テンプレート
                </Heading>
                <Card.Root size="sm" mb={4}>
                  <Card.Body>
                    <Stack spaceY={4}>
                      <FormField label="初めの言葉（感謝の言葉）">
                        <Textarea placeholder="例：お誘い頂きありがとうございます。" />
                      </FormField>
                      <FormField label="締めの言葉（代替案）">
                        <Textarea placeholder="例：またの機会にぜひお願いします。" />
                      </FormField>
                      <Checkbox.Root variant="solid" colorPalette="blue" size="sm">
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label fontSize="sm">実行済み</Checkbox.Label>
                      </Checkbox.Root>

                      <FormField required label="実行結果">
                        <Textarea placeholder="実際にこのテンプレートを使ってみた結果を書いてください。" />
                      </FormField>
                    </Stack>
                  </Card.Body>
                </Card.Root>
                <PrimaryButton variant="outline">
                  <FiPlus />
                  テンプレートを追加
                </PrimaryButton>
              </Card.Body>
            </Card.Root>
            <PrimaryButton>
              <LiaSaveSolid />
              作成する
            </PrimaryButton>
          </Fieldset.Content>
        </Fieldset.Root>
      </Form>
    </MainContainer>
  );
};
