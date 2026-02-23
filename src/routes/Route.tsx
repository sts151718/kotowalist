import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { selectPost } from '@/lib/supabase/declinePosts';
import type { DeclincePost } from '@/domain/DeclinePost';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      children: [
        {
          path: 'templates/:publicId',
          Component: TemplateDetail,
          hydrateFallbackElement: <></>,
          loader: ({ params }: LoaderFunctionArgs): { currentPostPromise: Promise<DeclincePost> } => {
            const currentPostPromise = selectPost(params.publicId ?? '');

            return { currentPostPromise };
          },
        },
        {
          path: '*',
          Component: Page404,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
