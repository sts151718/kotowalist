import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './components/ui/provider.tsx';
import { PageRoute } from './routes/Route.tsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <PageRoute />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
