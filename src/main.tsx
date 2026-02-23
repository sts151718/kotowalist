import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './components/ui/provider.tsx';
import { PageRoute } from './routes/Route.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <PageRoute />
    </Provider>
  </StrictMode>
);
