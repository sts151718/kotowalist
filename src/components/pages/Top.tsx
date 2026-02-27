import { useEffect, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Box, Center, Stack } from '@chakra-ui/react';
import { Link, useLoaderData } from 'react-router';
import { useFetchPostList } from '@/hooks/useFetchPostList';
import { useInfinityScroll } from '@/hooks/useInfinityScroll';
import { MainSpinner } from '../atoms/MainSpinner';
import { PostSummaryCard } from '../organisms/PostSummaryCard';

export const Top: FC = () => {
  const { maxPage } = useLoaderData<{ maxPage: number }>();

  const { isLoading, postList, hasMore, fetchPostList } = useFetchPostList(maxPage);
  const { targetRef } = useInfinityScroll({
    isLoading,
    hasMore,
    callback: fetchPostList,
    options: {
      threshold: 1,
      rootMargin: '0px 0px 100px 0px',
    },
  });

  useEffect(() => {
    (() => {
      // 初期表示時の一覧取得もここで行う。
      fetchPostList();
    })();
  }, []);

  return (
    <MainContainer>
      <PrimaryHeading description="断り方のテンプレートを共有して、みんなで克服しよう">テンプレート一覧</PrimaryHeading>
      <Stack as="ul" gap={4}>
        {postList.map((post) => (
          <Link key={post.id} to={`/templates/${post.publicId}`}>
            <PostSummaryCard post={post} />
          </Link>
        ))}

        {isLoading && (
          <Center h="80px">
            <MainSpinner />
          </Center>
        )}
      </Stack>
      <Box ref={targetRef} w="full" h={0} />
    </MainContainer>
  );
};
