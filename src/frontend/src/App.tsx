import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TitleDetailPage from './pages/TitleDetailPage';
import AdminUploadPage from './pages/AdminUploadPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const titleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/title/$id',
  component: TitleDetailPage,
});

const adminUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/upload',
  component: AdminUploadPage,
});

const routeTree = rootRoute.addChildren([indexRoute, titleDetailRoute, adminUploadRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
