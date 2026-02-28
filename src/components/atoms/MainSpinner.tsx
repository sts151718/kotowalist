import { Spinner } from '@chakra-ui/react';
import type { FC } from 'react';

type Props = {
  size?: 'md' | 'sm' | 'lg' | 'xl' | 'inherit' | 'xs';
};

export const MainSpinner: FC<Props> = (props) => {
  const { size = 'md' } = props;

  return <Spinner color="green.600" size={size} data-testid="main-spinner" />;
};
