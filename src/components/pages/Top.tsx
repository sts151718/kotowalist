import { Suspense, type FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Box, Card, Center, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { Await, useLoaderData } from 'react-router';
import { DeclincePost } from '@/domain/DeclinePost';
import { StatusTag } from '../molecules/StatusTag';
import { TipTapReactElement } from '../atoms/tiptap/TipTapReactElement';

export const Top: FC = () => {
  const { postListPromise } = useLoaderData<{ postListPromise: Promise<Array<DeclincePost>> }>();

  return (
    <MainContainer>
      <PrimaryHeading description="断り方のテンプレートを共有して、みんなで克服しよう">テンプレート一覧</PrimaryHeading>
      <Stack as="ul" gap={4}>
        <Suspense
          fallback={
            <Center>
              <Spinner />
            </Center>
          }
        >
          <Await resolve={postListPromise}>
            {(postList) =>
              postList.map((post) => (
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
              ))
            }
          </Await>
        </Suspense>
      </Stack>
    </MainContainer>
  );
};
