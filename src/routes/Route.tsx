import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetail } from '../components/pages/TemplateDetail';
import { Page404 } from '../components/pages/Page404';
import { Top } from '@/components/pages/Top';
import { postListLoader } from './loader/postListLoader';
import { topLoader } from './loader/topLoader';
import { templateDetailLoader } from './loader/templateDetailLoader';
import { SignUp } from '@/components/pages/SignUp';
import { signUpAction } from './actions/signUpAction';
import { SignIn } from '@/components/pages/SignIn';
import { signInAction } from './actions/signInAction';
import { authLoader } from './loader/authClaimsLoader';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      Component: MainLayout,
      loader: authLoader,
      children: [
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: topLoader,
        },
        {
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
          path: 'signup',
          Component: SignUp,
          action: signUpAction,
        },
        {
          path: 'signin',
          Component: SignIn,
          action: signInAction,
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
