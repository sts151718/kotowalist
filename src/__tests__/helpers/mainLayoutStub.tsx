import { MainLayout } from '@/components/layouts/MainLayout';
import { createRoutesStub } from 'react-router';

type StubRoutes = Parameters<typeof createRoutesStub>[0];
type StubRootRoute = StubRoutes[number];
export type StubChildRoute = NonNullable<StubRootRoute['children']>[number];

export const createDefaultMainLayoutRoot = async (): Promise<StubChildRoute[]> => {
  const SignUp = (await import('@/components/pages/SignUp')).SignUp;
  const Top = (await import('@/components/pages/Top')).Top;

  return [
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
};

export const createMainLayoutStubRoot = (children: Array<StubChildRoute>): StubRootRoute => ({
  Component: MainLayout,
  children,
});
