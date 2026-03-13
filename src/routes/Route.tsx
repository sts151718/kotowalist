import { createBrowserRouter, RouterProvider } from 'react-router';
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
import { authLoader } from './loader/authLoader';
import { guestOnlyLoader } from './loader/guestOnlyLoader';
import { TemplateCreate } from '@/components/pages/TemplateCreate';
import { templateCreateAction } from './actions/templateCreateAction';
import { authRequiredLoader } from './loader/authRequiredLoader';

export const PageRoute = () => {
  const router = createBrowserRouter([
    {
      id: 'root',
      Component: MainLayout,
      loader: authLoader,
      children: [
        {
          loader: authRequiredLoader,
          children: [
            {
              path: 'templates/create',
              Component: TemplateCreate,
              action: templateCreateAction,
            },
          ],
        },
        {
          loader: guestOnlyLoader,
          children: [
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
          ],
        },
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
          path: '*',
          Component: Page404,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
