import { Button, Flex } from '@chakra-ui/react';
import type { FC, MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const HeaderTextButton: FC<Props> = (props) => {
  const { children, onClick } = props;

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size={{ base: 'xs', md: 'sm' }}
      alignItems="center"
      px={0}
      color="inherit"
      bg="transparent"
      borderRadius="none"
      _hover={{ opacity: 0.75, bg: 'transparent' }}
    >
      {children}
    </Button>
  );
};
