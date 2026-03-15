import { Suspense, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { BackLink } from '../molecules/link/BackLink';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Await, useActionData, useLoaderData, useParams } from 'react-router';
import type { TemplateUpdateError } from '@/routes/actions/templateUpdateAction';
import type { DeclincePost } from '@/domain/DeclinePost';
import { Center } from '@chakra-ui/react';
import { MainSpinner } from '../atoms/MainSpinner';
import { TemplateEditorForm } from '../organisms/TemplateEditorForm';

export const TemplateEdit: FC = () => {
  const { publicId } = useParams();
  const { currentPostPromise } = useLoaderData<{ currentPostPromise: Promise<DeclincePost> }>();
  const actionData = useActionData<TemplateUpdateError>();

  return (
    <MainContainer testId="template-edit-page">
      <BackLink to={`/templates/${publicId ?? ''}`}>詳細へ戻る</BackLink>
      <PrimaryHeading>テンプレート編集</PrimaryHeading>

      <Suspense
        fallback={
          <Center mt={4}>
            <MainSpinner />
          </Center>
        }
      >
        <Await resolve={currentPostPromise}>
          {(currentPost) => (
            <TemplateEditorForm formError={actionData?.message} post={currentPost} submitLabel="更新する" />
          )}
        </Await>
      </Suspense>
    </MainContainer>
  );
};
