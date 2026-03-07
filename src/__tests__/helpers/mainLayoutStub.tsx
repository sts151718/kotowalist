import { MainLayout } from '@/components/layouts/MainLayout';
import { Top } from '@/components/pages/Top';
import { createRoutesStub } from 'react-router';
import { SignUp } from '@/components/pages/SignUp';
import 'react-intersection-observer/test-utils';
import { User } from '@/domain/User';
import type { AuthClaims } from '@/lib/supabase/types/auth';
import { AuthError } from '@supabase/supabase-js';

type StubRoutes = Parameters<typeof createRoutesStub>[0];
type StubRootRoute = StubRoutes[number];
export type StubChildRoute = NonNullable<StubRootRoute['children']>[number];

vi.mock('@/lib/supabase/users', () => ({
  existsEmail: vi.fn().mockResolvedValue(true),
  existsUserName: vi.fn().mockResolvedValue(true),
}));

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
  },
];

export const createMainLayoutStubRoot = (
  children: StubChildRoute[],
  authState: 'guest' | 'login' | 'error' = 'guest'
): StubRootRoute => ({
  Component: MainLayout,
  loader: async () => {
    const claimsByState = {
      guest: {
        data: null,
        error: null,
      } as AuthClaims,
      login: {
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

    const claims = claimsByState[authState];
    const authUser = authState === 'login' ? new User(1, 'test_user') : null;
    return { claims, authUser };
  },
  children,
});
