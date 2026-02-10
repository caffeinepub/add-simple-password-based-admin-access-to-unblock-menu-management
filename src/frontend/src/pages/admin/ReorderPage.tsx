import { useState } from 'react';
import { useGetCategories, useGetAllFoodItems } from '../../hooks/useQueries';
import { useReorderCategories, useReorderFoodItems } from '../../hooks/useAdminMutations';
import AdminLayout from '../../components/admin/AdminLayout';
import ReorderList from '../../components/admin/ReorderList';
import { RequestState } from '../../components/state/RequestState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Category, FoodItem } from '../../backend';

export default function ReorderPage() {
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategories();
  const { data: allItems = [], isLoading: itemsLoading, error: itemsError } = useGetAllFoodItems();
  const reorderCategories = useReorderCategories();
  const reorderItems = useReorderFoodItems();

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categoryItems = selectedCategory
    ? allItems.filter((item) => item.categoryId === selectedCategory)
    : [];

  const handleReorderCategories = async (newOrder: string[]) => {
    try {
      await reorderCategories.mutateAsync(newOrder);
      toast.success('Categories reordered successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder categories');
    }
  };

  const handleReorderItems = async (newOrder: string[]) => {
    try {
      await reorderItems.mutateAsync(newOrder);
      toast.success('Items reordered successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder items');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Reorder</h2>
          <p className="text-muted-foreground mt-1">Drag and drop to reorder categories and items</p>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <RequestState
              isLoading={categoriesLoading}
              error={categoriesError}
              isEmpty={categories.length === 0}
              emptyMessage="No categories to reorder"
            >
              <ReorderList
                items={categories}
                getKey={(cat) => cat.id}
                renderItem={(cat: Category) => (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat.name}</span>
                    <Badge variant={cat.enabled ? 'default' : 'secondary'}>
                      {cat.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                )}
                onReorder={handleReorderCategories}
              />
            </RequestState>
          </TabsContent>

          <TabsContent value="items" className="mt-6">
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Choose a category" />
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

            {selectedCategory ? (
              <RequestState
                isLoading={itemsLoading}
                error={itemsError}
                isEmpty={categoryItems.length === 0}
                emptyMessage="No items in this category"
              >
                <ReorderList
                  items={categoryItems}
                  getKey={(item) => item.id}
                  renderItem={(item: FoodItem) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant={item.enabled ? 'default' : 'secondary'}>
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  )}
                  onReorder={handleReorderItems}
                />
              </RequestState>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Select a category to reorder its items
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
