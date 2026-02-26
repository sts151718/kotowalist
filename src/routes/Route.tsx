import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { countAllPost, selectPost } from '@/lib/supabase/declinePosts';
import type { DeclincePost } from '@/domain/DeclinePost';
import { Top } from '@/components/pages/Top';
import { POSTS_PAGE_PER_PAGE } from '@/consts/pagination';
import { postListLoader } from './loader/postListLoader';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      children: [
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: async (): Promise<{ maxPage: number }> => {
            const postTotal = await countAllPost();

            const maxPage = Math.ceil(postTotal / POSTS_PAGE_PER_PAGE);

            return { maxPage };
          },
        },
        {
          // 一覧読み込み用のルーティング
          path: 'resources/posts',
          loader: postListLoader,
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
