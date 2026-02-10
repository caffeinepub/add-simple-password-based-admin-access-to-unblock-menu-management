import { ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoginButton from '../auth/LoginButton';
import { LayoutDashboard, List, UtensilsCrossed, ArrowUpDown, Eye, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/categories', label: 'Categories', icon: List },
    { path: '/admin/items', label: 'Food Items', icon: UtensilsCrossed },
    { path: '/admin/reorder', label: 'Reorder', icon: ArrowUpDown },
    { path: '/admin/preview', label: 'Preview', icon: Eye },
  ];

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'restaurant-menu');

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/assets/generated/cafe-logo.dim_512x512.png"
                alt="Logo"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your restaurant menu</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })}>
                <Home className="h-4 w-4 mr-2" />
                View Menu
              </Button>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1">
        <nav className="mb-6">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        <Separator className="mb-6" />

        <main>{children}</main>
      </div>

      <footer className="mt-auto border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} · Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
