import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import PublicMenuPage from './pages/PublicMenuPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import FoodItemsPage from './pages/admin/FoodItemsPage';
import ReorderPage from './pages/admin/ReorderPage';
import LivePreviewPage from './pages/admin/LivePreviewPage';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicMenuPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <Outlet />
    </AdminRouteGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/categories',
  component: CategoriesPage,
});

const adminItemsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/items',
  component: FoodItemsPage,
});

const adminReorderRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reorder',
  component: ReorderPage,
});

const adminPreviewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/preview',
  component: LivePreviewPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminCategoriesRoute,
    adminItemsRoute,
    adminReorderRoute,
    adminPreviewRoute,
  ]),
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
