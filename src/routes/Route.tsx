import { Route, Routes } from 'react-router';
import { MainLayout } from '../components/layouts/MainLayout';
import { TemplateDetails } from '../components/pages/TemplateDetails';
import { Page404 } from '../components/pages/Page404';

export const PageRoute = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<TemplateDetails />} path="/templates/:id" />
        <Route element={<Page404 />} path="*" />
      </Route>
    </Routes>
  );
};
