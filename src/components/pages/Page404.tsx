import { Heading, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';

export const Page404: FC = () => {
  return (
    <MainContainer>
      <Heading as="h2">Not Found 404</Heading>
      <Text>ページが見つかりませんでした。</Text>
    </MainContainer>
  );
};
