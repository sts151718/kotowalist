import { useEffect, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Box, Card, Center, Float, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { Link, useLoaderData } from 'react-router';
import { StatusTag } from '../molecules/StatusTag';
import { TipTapReactElement } from '../atoms/tiptap/TipTapReactElement';
import { useFetchPostList } from '@/hooks/useFetchPostList';
import { useInfinityScroll } from '@/hooks/useInfinityScroll';
import { MainSpinner } from '../atoms/MainSpinner';

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
            <Card.Root
              size="sm"
              variant="elevated"
              shadow="sm"
              cursor="pointer"
              scale={1}
              _active={{ scale: 0.98, shadow: 'xs' }}
              _hover={{ shadow: 'md' }}
            >
              <Card.Header>
                <Heading as="h3" size="sm">
                  {post.declineSituation}
                </Heading>
                <Text color="gray.400" fontSize="xs">
                  {post.user.userName}
                </Text>
              </Card.Header>
              <Card.Body fontSize="xs">
                {post.hasDoneTemplate() && (
                  <Box mb={2}>
                    <StatusTag type="done" />
                  </Box>
                )}
                {post.actualSituation === null || <TipTapReactElement json={post.actualSituation} />}
                <Text textAlign="right" color="gray.400" fontSize="xs">
                  {post.updatedAt}
                </Text>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}

        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
      </Stack>
      <Box ref={targetRef} w="full" h={0} />
    </MainContainer>
  );
};
