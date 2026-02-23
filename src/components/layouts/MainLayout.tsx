import { Box, Flex, Heading } from '@chakra-ui/react';
import type { FC } from 'react';
import { Link, Outlet } from 'react-router';

export const MainLayout: FC = () => {
  return (
    <>
      <Flex as="header" bg="green.50" color="green.700" w="full" px={4} py={2} shadow="md" role="banner">
        <Heading as="h1" size="md">
          <Link to="/">断リスト</Link>
        </Heading>
      </Flex>
      <Box as="main" role="main">
        <Outlet />
      </Box>
    </>
  );
};
