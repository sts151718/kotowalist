import { Button } from '@chakra-ui/react';
import type { FC, MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const HeaderPrimaryButton: FC<Props> = (props) => {
  const { children, onClick } = props;

  return (
    <Button colorPalette="green" size={{ base: 'xs', md: 'sm' }} onClick={onClick}>
      {children}
    </Button>
  );
};
