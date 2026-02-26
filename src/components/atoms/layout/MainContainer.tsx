import { Container } from '@chakra-ui/react';
import type { FC, ReactNode, RefObject } from 'react';

type Props = {
  children: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
};

export const MainContainer: FC<Props> = (props) => {
  const { children, ref } = props;
  const refProps = ref ? { ref } : {};

  return (
    <Container py={6} {...refProps}>
      {children}
    </Container>
  );
};
