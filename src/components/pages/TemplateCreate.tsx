import { type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { BackLink } from '../molecules/link/BackLink';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Card, Fieldset, Heading, Input } from '@chakra-ui/react';
import { Form } from 'react-router';
import { FormField } from '../molecules/form/FormField';
import { TiptapEditor } from '../molecules/tiptap/TiptapEditor';
import { FiPlus } from 'react-icons/fi';
import { LiaSaveSolid } from 'react-icons/lia';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { TemplateBlockCard } from '../molecules/template/TemplateBlockCard';
import { useTemplateForms } from '@/hooks/useTemplateForms';

// export const TemplateCreateFormSchema = z.object({
//   declineSituation: z.string().min(1, { message: '断りたい状況は必須です' }),
//   // Tiptapオブジェクトとの統合をするため一旦、any型
//   // TODO: 適切な型を後でつける
//   actualSituation: z.any().nullable(),
//   actualFeeling: z.any().nullable(),
// });

// type TemplateForm = z.infer<typeof TemplateSchema>;

export const TemplateCreate: FC = () => {
  const { templateForms, addTemplateForm } = useTemplateForms();

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
                {templateForms.map((template) => (
                  <TemplateBlockCard key={template.clientId} />
                ))}
                <PrimaryButton variant="outline" onClick={addTemplateForm}>
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
