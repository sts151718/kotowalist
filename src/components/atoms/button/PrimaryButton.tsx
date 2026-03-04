import { Button, type ButtonProps } from '@chakra-ui/react';
import type { FC } from 'react';

type Props = Omit<ButtonProps, 'colorPalette'>;

export const PrimaryButton: FC<Props> = (props) => {
  return <Button {...props} colorPalette="blue"></Button>;
};
