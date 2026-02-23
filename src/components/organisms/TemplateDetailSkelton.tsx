import { Box, HStack, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';
import { memo, type FC } from 'react';
import { TemplateDetailLayout } from './TemplateDetailLayout';

export const TemplateDetailSkelton: FC = memo(() => {
  return (
    <TemplateDetailLayout
      testId="template-detail-skelton"
      header={
        <>
          <Skeleton h="24px" w="60%" mb={3} />
          <HStack gap={3}>
            <Skeleton h="10px" w="72px" />
            <Skeleton h="10px" w="72px" />
          </HStack>
        </>
      }
    >
      <Box px={4}>
        <Skeleton h="18px" w="90px" mb={2} />
        <SkeletonText noOfLines={2} gap="2" />
      </Box>
      <Box px={4}>
        <Skeleton h="18px" w="90px" mb={2} />
        <SkeletonText noOfLines={2} gap="2" />
      </Box>
      <Box px={4}>
        <Skeleton h="18px" w="140px" mb={2} />
        <SkeletonText noOfLines={2} gap="2" />
      </Box>
      <Box px={4}>
        <Stack gap={2}>
          <Stack bg="gray.50" borderRadius="md" p={3}>
            <Skeleton h="16px" w="110px" mb={2} />
            <SkeletonText noOfLines={2} gap="2" mb={3} />
            <Skeleton h="16px" w="80px" mb={2} />
          </Stack>
        </Stack>
      </Box>
    </TemplateDetailLayout>
  );
});
