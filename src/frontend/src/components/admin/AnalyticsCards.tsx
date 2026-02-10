import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '../../utils/format';
import type { AnalyticsData } from '../../backend';
import { List, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

interface AnalyticsCardsProps {
  data: AnalyticsData;
}

export default function AnalyticsCards({ data }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Total Categories',
      value: formatNumber(data.totalCategories),
      icon: List,
      color: 'text-chart-1',
    },
    {
      title: 'Total Items',
      value: formatNumber(data.totalItems),
      icon: UtensilsCrossed,
      color: 'text-chart-2',
    },
    {
      title: 'Active Items',
      value: formatNumber(data.activeItems),
      icon: CheckCircle2,
      color: 'text-chart-3',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
