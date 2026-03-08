import { MainLayout } from '@/components/layouts/MainLayout';
import { Top } from '@/components/pages/Top';
import { createRoutesStub } from 'react-router';
import { SignUp } from '@/components/pages/SignUp';
import 'react-intersection-observer/test-utils';
import { User } from '@/domain/User';
import type { AuthClaims } from '@/lib/supabase/types/auth';
import { AuthError } from '@supabase/supabase-js';
import { SignIn } from '@/components/pages/SignIn';
import { guestOnlyLoader } from '@/routes/loader/guestOnlyLoader';
import { supabase } from '@/lib/supabase/setup';

type StubRoutes = Parameters<typeof createRoutesStub>[0];
type StubRootRoute = StubRoutes[number];
export type StubChildRoute = NonNullable<StubRootRoute['children']>[number];
export type MockAuthState = 'guest' | 'authenticated' | 'error';

vi.mock('@/lib/supabase/users', () => ({
  existsEmail: vi.fn().mockResolvedValue(true),
  existsUserName: vi.fn().mockResolvedValue(true),
}));

const claimsByState: Record<MockAuthState, AuthClaims> = {
  guest: {
    data: null,
    error: null,
  } as AuthClaims,
  authenticated: {
    data: {
      claims: {
        sub: 'test-auth-id',
      },
    },
    error: null,
  } as AuthClaims,
  error: {
    data: null,
    error: new AuthError('mock signin error'),
  } as AuthClaims,
};

export const createDefaultMainLayoutRoot = (): StubChildRoute[] => [
  {
    path: '/',
    Component: Top,
    hydrateFallbackElement: <></>,
    loader: async () => ({ maxPage: 1 }),
  },
  {
    path: '/resources/posts',
    hydrateFallbackElement: <></>,
    loader: async () => Promise.resolve([]),
  },
  {
    path: 'signup',
    Component: SignUp,
    action: async () => ({}),
    loader: guestOnlyLoader,
  },
  {
    path: 'signin',
    Component: SignIn,
    action: async () => ({}),
    loader: guestOnlyLoader,
  },
];

export const stubAuthenticatedUser = new User(1, 'test_user');
export const createMainLayoutStubRoot = (
  children: StubChildRoute[],
  authState: MockAuthState = 'guest'
): StubRootRoute => {
  const claims = claimsByState[authState];
  vi.spyOn(supabase.auth, 'getClaims').mockResolvedValue(claims);

  return {
    Component: MainLayout,
    loader: async () => {
      const authUser = authState === 'authenticated' ? stubAuthenticatedUser : null;
      return { claims, authUser };
    },
    children,
  };
};
