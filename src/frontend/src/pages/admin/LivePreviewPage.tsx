import AdminLayout from '../../components/admin/AdminLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import PublicMenuPage from '../PublicMenuPage';

export default function LivePreviewPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Live Preview</h2>
          <p className="text-muted-foreground mt-1">See how your menu looks to customers</p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is a live preview of your public menu. Changes you make in the admin panel will be reflected here after saving.
          </AlertDescription>
        </Alert>

        <div className="border-4 border-dashed border-muted rounded-lg overflow-hidden">
          <PublicMenuPage />
        </div>
      </div>
    </AdminLayout>
  );
}
