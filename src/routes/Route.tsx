import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { selectPost, selectPostList } from '@/lib/supabase/declinePosts';
import type { DeclincePost } from '@/domain/DeclinePost';
import { Top } from '@/components/pages/Top';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      children: [
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: (): { postListPromise: Promise<Array<DeclincePost>> } => {
            const page = 1;
            const postListPromise = selectPostList(page);

            return { postListPromise };
          },
        },
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
