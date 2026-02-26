import { useCallback, useEffect, useState, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Box, Card, Center, Float, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { useFetcher, useLoaderData } from 'react-router';
import { DeclincePost } from '@/domain/DeclinePost';
import { StatusTag } from '../molecules/StatusTag';
import { TipTapReactElement } from '../atoms/tiptap/TipTapReactElement';
import type { postListLoader } from '@/routes/loader/postListLoader';

const calcHasMore = (maxPage: number, page: number) => maxPage >= page;

export const Top: FC = () => {
  const { maxPage } = useLoaderData<{ maxPage: number }>();
  const fetcher = useFetcher<typeof postListLoader>();

  const [isLoading, setIsLoading] = useState(true);
  const [postList, setPostList] = useState<Array<DeclincePost>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(calcHasMore(maxPage, currentPage));

  useEffect(() => {
    (() => {
      // 初期表示時の一覧取得もここで行う。
      fetcher.load(`/resources/posts?page=${currentPage}`);
    })();
  }, []);

  useEffect(() => {
    (() => {
      if (fetcher.data) {
        setPostList([...postList, ...fetcher.data]);
        setIsLoading(false);
      }
    })();
  }, [fetcher.data]);

  const bottomRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return;

      const option = {
        root: null,
        rootMargin: '0px 0px 100px 0px',
        threshold: 1,
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading && hasMore) {
            setIsLoading(true);

            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            setHasMore(calcHasMore(maxPage, nextPage));

            fetcher.load(`/resources/posts?page=${nextPage}`);
          }
        });
      }, option);

      observer.observe(node);

      return () => {
        observer.unobserve(node);
      };
    },
    [isLoading, fetcher, currentPage, hasMore, maxPage]
  );

  return (
    <MainContainer>
      <PrimaryHeading description="断り方のテンプレートを共有して、みんなで克服しよう">テンプレート一覧</PrimaryHeading>
      <Stack as="ul" gap={4}>
        {postList.map((post) => (
          <Card.Root
            key={post.id}
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
        ))}

        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
      </Stack>
      <Float ref={bottomRef} w="full" h={0} placement="bottom-center" zIndex={-1} />
    </MainContainer>
  );
};
