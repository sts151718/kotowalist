import { Box, Flex, Heading, Icon } from '@chakra-ui/react';
import { type FC } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { IoPersonAddOutline } from 'react-icons/io5';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { HeaderPrimaryButton } from '../atoms/button/HeaderPrimaryButton';
import { HeaderTextButton } from '../atoms/button/HeaderTextButton';
import { useAuthState } from '@/hooks/useAuthState';
import { LuCirclePlus } from 'react-icons/lu';
import { supabase } from '@/lib/supabase/setup';
import { FaRegUser } from 'react-icons/fa';
import { useAuthUserStore } from '@/store/useAuthUserStore';

export const MainLayout: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthState();
  const authUser = useAuthUserStore((state) => state.user);

  const onClickSignup = () => {
    navigate('/signup');
  };

  const onClickSignin = () => {
    navigate('/signin');
  };

  const onClickCreate = () => {
    navigate('/templates/create');
  };

  const onClickSignout = () => {
    supabase.auth.signOut({ scope: 'local' });
  };

  return (
    <>
      <Box as="header" bg="green.50" shadow="md" role="banner" position="sticky" top={0} zIndex={100}>
        <Flex justifyContent="space-between" alignItems="center" w="full" px={{ base: 4, md: 16 }} py={2}>
          <Heading as="h1" size={{ base: 'sm', md: 'lg' }} color="green.700">
            <Link to="/">断リスト</Link>
          </Heading>

          {isAuthenticated ? (
            <Box as="nav" fontSize={{ base: 'xs', md: 'sm' }}>
              <Flex as="ul" gap={2} alignItems="stretch">
                <Box as="li">
                  <HeaderPrimaryButton onClick={onClickCreate}>
                    <LuCirclePlus />
                    新規投稿
                  </HeaderPrimaryButton>
                </Box>
                <Box as="li" display={{ base: 'none', md: 'block' }}>
                  <Flex alignItems="center" h="full" gap={1} fontSize="xs">
                    <Icon size="xs">
                      <FaRegUser />
                    </Icon>
                    {authUser?.userName}
                  </Flex>
                </Box>
                <Box as="li">
                  <HeaderTextButton onClick={onClickSignout}>
                    <Icon size="sm">
                      <CiLogout />
                    </Icon>
                    ログアウト
                  </HeaderTextButton>
                </Box>
              </Flex>
            </Box>
          ) : (
            <Box as="nav" fontSize={{ base: 'xs', md: 'sm' }}>
              <Flex as="ul" gap={2} alignItems="stretch">
                <Box as="li" display="flex">
                  <HeaderTextButton onClick={onClickSignin}>
                    <Icon size="sm">
                      <CiLogin />
                    </Icon>
                    ログイン
                  </HeaderTextButton>
                </Box>
                <Box as="li">
                  <HeaderPrimaryButton onClick={onClickSignup}>
                    <IoPersonAddOutline />
                    新規登録
                  </HeaderPrimaryButton>
                </Box>
              </Flex>
            </Box>
          )}
        </Flex>
      </Box>
      <Box as="main" role="main">
        <Outlet />
      </Box>
    </>
  );
};
