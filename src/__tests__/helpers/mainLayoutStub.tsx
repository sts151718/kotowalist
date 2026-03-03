import { MainLayout } from '@/components/layouts/MainLayout';
import { Top } from '@/components/pages/Top';
import { Signup } from '@/components/pages/SignUp';
import { createRoutesStub } from 'react-router';

type StubRoutes = Parameters<typeof createRoutesStub>[0];
type StubRootRoute = StubRoutes[number];
export type StubChildRoute = NonNullable<StubRootRoute['children']>[number];

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
