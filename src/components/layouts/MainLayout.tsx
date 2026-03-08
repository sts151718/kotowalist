import { Box } from '@chakra-ui/react';
import { type FC } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Header } from './Header';
import { useAuthState } from '@/hooks/useAuthState';
import { signOut } from '@/lib/supabase/auth';

export const MainLayout: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authUser } = useAuthState();

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
    signOut();
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        userName={authUser?.userName ?? null}
        onClickSignup={onClickSignup}
        onClickSignin={onClickSignin}
        onClickCreate={onClickCreate}
        onClickSignout={onClickSignout}
      />
      <Box as="main" role="main">
        <Outlet />
      </Box>
    </>
  );
};
