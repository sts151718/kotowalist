import { Box, Flex, Heading, Icon } from '@chakra-ui/react';
import type { FC } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { IoPersonAddOutline } from 'react-icons/io5';
import { HeaderLink } from '../atoms/link/HeaderLink';
import { CiLogin } from 'react-icons/ci';
import { HeaderNavButton } from '../atoms/button/HeaderNavButton';

export const MainLayout: FC = () => {
  const navigate = useNavigate();

  const onClickSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <Box as="header" bg="green.50" shadow="md" role="banner" position="sticky" top={0} zIndex={100}>
        <Flex justifyContent="space-between" alignItems="center" w="full" px={{ base: 4, md: 16 }} py={2}>
          <Heading as="h1" size={{ base: 'sm', md: 'lg' }} color="green.700">
            <Link to="/">断リスト</Link>
          </Heading>

          <Box as="nav" fontSize={{ base: 'xs', md: 'sm' }}>
            <Flex as="ul" gap={4} alignItems="stretch">
              <Box as="li" display="flex">
                <HeaderLink to="/signin">
                  <Icon size="sm">
                    <CiLogin />
                  </Icon>
                  ログイン
                </HeaderLink>
              </Box>
              <Box as="li">
                <HeaderNavButton onClick={onClickSignup}>
                  <IoPersonAddOutline />
                  新規登録
                </HeaderNavButton>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box as="main" role="main">
        <Outlet />
      </Box>
    </>
  );
};
