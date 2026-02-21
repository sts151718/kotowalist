import { Box } from '@chakra-ui/react';
import type { FC } from 'react';
import { Outlet } from 'react-router';

export const MainLayout: FC = () => {
  return (
    <>
      <Box as="main">
        <Outlet />
      </Box>
    </>
  );
};
