import { MainLayout } from '@/components/layouts/MainLayout';
import { Top } from '@/components/pages/Top';
import { createRoutesStub } from 'react-router';
import { Signup } from '@/components/pages/SignUp';
import 'react-intersection-observer/test-utils';

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
    Component: Signup,
    action: async () => ({}),
  },
];

export const createMainLayoutStubRoot = (children: StubChildRoute[]): StubRootRoute => ({
  Component: MainLayout,
  children,
});
