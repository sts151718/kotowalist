import { Suspense, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import type { DeclincePost } from '@/domain/DeclinePost';
import { Await, useLoaderData } from 'react-router';
import { TemplateDetailCard } from '../organisms/TemplateDetailCard';
import { TemplateDetailSkelton } from '../organisms/TemplateDetailSkelton';
import { BackLink } from '../molecules/link/BackLink';

export const TemplateDetail: FC = () => {
  const { currentPostPromise } = useLoaderData<{ currentPostPromise: Promise<DeclincePost> }>();

  return (
    <MainContainer>
      <BackLink to="/">一覧へ戻る</BackLink>
      <Suspense fallback={<TemplateDetailSkelton />}>
        <Await resolve={currentPostPromise}>{(currentPost) => <TemplateDetailCard post={currentPost} />}</Await>
      </Suspense>
    </MainContainer>
  );
};
