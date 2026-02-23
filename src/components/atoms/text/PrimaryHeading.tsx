import { Heading } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const PrimaryHeading: FC<Props> = (props) => {
  const { children } = props;

  return (
    <Heading as="h2" mb={2} size="xl">
      {children}
    </Heading>
  );
};
