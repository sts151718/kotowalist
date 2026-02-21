import { Container } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const MainContainer: FC<Props> = (props) => {
  const { children } = props;
  return <Container>{children}</Container>;
};
