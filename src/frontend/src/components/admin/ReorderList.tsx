import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface ReorderListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onReorder: (newOrder: string[]) => void;
}

export default function ReorderList<T>({ items, getKey, renderItem, onReorder }: ReorderListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [orderedItems, setOrderedItems] = useState(items);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...orderedItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setOrderedItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    const newOrder = orderedItems.map(getKey);
    onReorder(newOrder);
  };

  // Update when items prop changes
  if (items.length !== orderedItems.length || items.some((item, i) => getKey(item) !== getKey(orderedItems[i]))) {
    setOrderedItems(items);
  }

  return (
    <div className="space-y-2">
      {orderedItems.map((item, index) => (
        <Card
          key={getKey(item)}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`p-4 cursor-move hover:shadow-soft-lg transition-shadow ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">{renderItem(item)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
