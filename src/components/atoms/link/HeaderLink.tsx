import { Link as ChakraLink, Flex } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

type Props = {
  children: ReactNode;
  to: string;
};

export const HeaderLink: FC<Props> = (props) => {
  const { children, to } = props;

  return (
    <ChakraLink asChild display="flex" alignItems="center" h="full" _hover={{ opacity: 0.75, textDecoration: 'none' }}>
      <RouterLink to={to}>
        <Flex alignItems="center" gap={1} h="full">
          {children}
        </Flex>
      </RouterLink>
    </ChakraLink>
  );
};
