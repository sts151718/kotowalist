import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { BackLink } from '../molecules/link/BackLink';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { useActionData } from 'react-router';
import type { TemplateCreateError } from '@/routes/actions/templateCreateAction';
import { TemplateEditorForm } from '../organisms/TemplateEditorForm';

export const TemplateCreate: FC = () => {
  const actionData = useActionData<TemplateCreateError>();

  return (
    <MainContainer testId="template-create-page">
      <BackLink to="/">一覧へ戻る</BackLink>
      <PrimaryHeading description="断り方のテンプレートを作成して、共有しよう">新規テンプレート作成</PrimaryHeading>
      <TemplateEditorForm formError={actionData?.message} submitLabel="作成する" />
    </MainContainer>
  );
};
