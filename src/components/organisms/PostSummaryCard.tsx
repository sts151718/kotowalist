import { Box, Card, Heading, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import type { DeclincePost } from '@/domain/DeclinePost';
import { StatusTag } from '../molecules/StatusTag';
import { TipTapReactElement } from '../atoms/tiptap/TipTapReactElement';

type Props = {
  post: DeclincePost;
};

export const PostSummaryCard: FC<Props> = ({ post }) => {
  return (
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
        <Heading as="h3" size="md">
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
        {!!post.actualSituation && <TipTapReactElement json={post.actualSituation} />}
        <Text textAlign="right" color="gray.400" fontSize="xs">
          {post.updatedAt}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
