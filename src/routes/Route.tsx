import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { countAllPost, selectPost, selectPostList } from '@/lib/supabase/declinePosts';
import type { DeclincePost } from '@/domain/DeclinePost';
import { Top } from '@/components/pages/Top';
import { POSTS_PAGE_PER_PAGE } from '@/consts/pagination';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      children: [
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: async (): Promise<{ postListPromise: Promise<Array<DeclincePost>> }> => {
            const page = 1;
            const offset = (page - 1) * POSTS_PAGE_PER_PAGE;
            const postListPromise = selectPostList(offset, POSTS_PAGE_PER_PAGE);

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
