import type { DeclincePost } from '@/domain/DeclinePost';
import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { memo, type FC } from 'react';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';
import { IconText } from '@/components/molecules/IconText';
import { TipTapReactElement } from '../atoms/tiptap/TipTapReactElement';
import { TemplateDetailLayout } from './TemplateDetailLayout';
import { StatusTag } from '../molecules/StatusTag';

type Props = {
  post: DeclincePost;
};

export const TemplateDetailCard: FC<Props> = memo((props) => {
  const { post } = props;

  const bodyPx = 4;
  return (
    <TemplateDetailLayout
      header={
        <>
          <Heading as="h2" size="xl">
            {post.declineSituation}
          </Heading>
          <HStack gap={4}>
            <IconText icon={<FaRegUser />} text={post.user.userName} color="gray.500" />
            <IconText icon={<FaRegCalendar />} text={post.updatedAt} color="gray.500" />
          </HStack>
        </>
      }
    >
      {post.actualSituation === null || (
        <Box px={bodyPx}>
          <Heading as="dt" size="md" mb={2}>
            実際の状況
          </Heading>
          <Box as="dd" fontSize="xs">
            <TipTapReactElement json={post.actualSituation} />
          </Box>
        </Box>
      )}
      {post.actualFeeling === null || (
        <Box px={bodyPx}>
          <Heading as="dt" size="md" mb={2}>
            当時の心境
          </Heading>
          <Box as="dd" fontSize="xs">
            <TipTapReactElement json={post.actualFeeling} />
          </Box>
        </Box>
      )}
      {post.demerit === null || (
        <Box px={bodyPx}>
          <Heading as="dt" size="md" mb={2}>
            断らなかったときのデメリット
          </Heading>
          <Box as="dd" fontSize="xs">
            <TipTapReactElement json={post.demerit} />
          </Box>
        </Box>
      )}
      <Box px={bodyPx}>
        <Box>
          {post.templates.map((template, index) => (
            <Stack as="dl" spaceY={2} key={template.id} bg="gray.50" borderRadius="md" p={4}>
              <Box>
                {template.doneFlag && <StatusTag type="done" />}
                <Heading as="dt" size="sm" mb={2}>
                  テンプレート{index + 1}
                </Heading>
                <Stack
                  as="dd"
                  p={2}
                  fontSize="sm"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius={4}
                >
                  <Text>{template.openingText}</Text>
                  <Text as="em" fontSize="sm" fontWeight="bold">
                    【理由（実際の状況で変えてください）】
                  </Text>
                  <Text>{template.closingText}</Text>
                </Stack>
              </Box>
              {template.doneFlag && (
                <Box>
                  <Heading as="dt" size="sm" mb={2}>
                    実行結果
                  </Heading>
                  <Box p={2} fontSize="xs" bg="purple.50" border="1px solid" borderColor="purple.200" borderRadius={4}>
                    {template.doneResult}
                  </Box>
                </Box>
              )}
            </Stack>
          ))}
        </Box>
      </Box>
    </TemplateDetailLayout>
  );
});
