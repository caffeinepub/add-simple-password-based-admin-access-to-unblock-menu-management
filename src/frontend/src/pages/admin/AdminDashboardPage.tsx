import { useGetAnalytics } from '../../hooks/useQueries';
import AdminLayout from '../../components/admin/AdminLayout';
import AnalyticsCards from '../../components/admin/AnalyticsCards';
import { RequestState } from '../../components/state/RequestState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { List, UtensilsCrossed, ArrowUpDown, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: analytics, isLoading, error } = useGetAnalytics();

  const quickActions = [
    {
      title: 'Manage Categories',
      description: 'Add, edit, or delete menu categories',
      icon: List,
      path: '/admin/categories',
    },
    {
      title: 'Manage Food Items',
      description: 'Add, edit, or delete menu items',
      icon: UtensilsCrossed,
      path: '/admin/items',
    },
    {
      title: 'Reorder Items',
      description: 'Change the order of categories and items',
      icon: ArrowUpDown,
      path: '/admin/reorder',
    },
    {
      title: 'Preview Menu',
      description: 'See how your menu looks to customers',
      icon: Eye,
      path: '/admin/preview',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your restaurant menu</p>
        </div>

        <RequestState isLoading={isLoading} error={error}>
          {analytics && <AnalyticsCards data={analytics} />}
        </RequestState>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.path} className="shadow-soft hover:shadow-soft-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate({ to: action.path })} className="w-full">
                      Go to {action.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
