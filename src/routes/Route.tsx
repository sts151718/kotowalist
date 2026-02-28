import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { Top } from '@/components/pages/Top';
import { postListLoader } from './loader/postListLoader';
import { topLoader } from './loader/topLoader';
import { templateDetailLoader } from './loader/templateDetailLoader';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      children: [
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: topLoader,
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
          loader: templateDetailLoader,
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
