import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface RequestStateProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  loadingComponent?: ReactNode;
}

export function RequestState({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  children,
  loadingComponent,
}: RequestStateProps) {
  if (isLoading) {
    return loadingComponent || <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  return <>{children}</>;
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
