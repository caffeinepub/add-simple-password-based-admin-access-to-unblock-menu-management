import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '../../utils/format';
import type { FoodItem } from '../../backend';
import { Flame, Snowflake } from 'lucide-react';
import OptimizedImage from '../media/OptimizedImage';

interface MenuItemCardProps {
  item: FoodItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-soft-lg transition-shadow duration-200">
      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
        {item.image ? (
          <OptimizedImage
            src={item.image.getDirectURL()}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Coffee className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={item.hot ? 'destructive' : 'secondary'} className="shadow-sm">
            {item.hot ? (
              <>
                <Flame className="h-3 w-3 mr-1" />
                Hot
              </>
            ) : (
              <>
                <Snowflake className="h-3 w-3 mr-1" />
                Cold
              </>
            )}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">{formatINR(item.price)}</span>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Coffee({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}
