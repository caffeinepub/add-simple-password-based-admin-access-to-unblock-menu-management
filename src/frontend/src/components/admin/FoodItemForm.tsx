import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import { formatINR } from '../../utils/format';
import type { FoodItem, Category } from '../../backend';
import { ExternalBlob } from '../../backend';

interface FoodItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: FoodItem | null;
  categories: Category[];
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    hot: boolean;
    categoryId: string;
    image: ExternalBlob | null;
  }) => Promise<void>;
  isPending: boolean;
}

export default function FoodItemForm({
  open,
  onOpenChange,
  item,
  categories,
  onSave,
  isPending,
}: FoodItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [hot, setHot] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<ExternalBlob | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price.toString());
      setHot(item.hot);
      setCategoryId(item.categoryId);
      setImage(item.image || null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setHot(false);
      setCategoryId(categories[0]?.id || '');
      setImage(null);
    }
  }, [item, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId) return;

    await onSave({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      hot,
      categoryId,
      image,
    });
  };

  const priceNum = parseFloat(price) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? 'Edit Food Item' : 'Add Food Item'}</DialogTitle>
            <DialogDescription>
              {item ? 'Update the food item details' : 'Create a new menu item'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cappuccino"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
                {priceNum > 0 && (
                  <p className="text-xs text-muted-foreground">Preview: {formatINR(priceNum)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dish..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hot">Temperature</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch id="hot" checked={hot} onCheckedChange={setHot} />
                  <span className="text-sm">{hot ? 'Hot' : 'Cold'}</span>
                </div>
              </div>
            </div>

            <ImageUploadField
              currentImage={item?.image}
              onImageChange={setImage}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !price || !categoryId || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
