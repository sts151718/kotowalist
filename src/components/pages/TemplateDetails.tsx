import { Heading } from '@chakra-ui/react';
import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';

export const TemplateDetails: FC = () => {
  return (
    <MainContainer>
      <Heading as="h2">テンプレート詳細</Heading>
    </MainContainer>
  );
};
