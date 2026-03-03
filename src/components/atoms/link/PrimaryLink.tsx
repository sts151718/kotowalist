import { Link as ChakraLink } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

type Props = {
  children: ReactNode;
  to: string;
};

export const PrimaryLink: FC<Props> = (props) => {
  const { children, to } = props;

  return (
    <ChakraLink
      asChild
      color="blue.600"
      _hover={{ textDecoration: 'underline', textDecorationColor: 'currentColor' }}
    >
      <RouterLink to={to}>{children}</RouterLink>
    </ChakraLink>
  );
};
