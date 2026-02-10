import { ReactNode } from 'react';
import { Coffee } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'restaurant-menu');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {children}
      
      <footer className="mt-auto border-t bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © {currentYear} · Built with <Coffee className="h-4 w-4 text-accent" /> using{' '}
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
