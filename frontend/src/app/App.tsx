import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { PublicRoutes } from './routes/PublicRoutes';
import { MerchantRoutes } from './routes/MerchantRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import { PageSkeleton } from '@/shared/ui/PageSkeleton';
import { DemoWidget } from '@/shared/ui/DemoWidget';

export function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <PublicRoutes />
          <MerchantRoutes />
          <AdminRoutes />
        </Suspense>
        <DemoWidget />
      </BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </>
  );
}

export default App;
