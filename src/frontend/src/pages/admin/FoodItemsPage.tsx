import { useState } from 'react';
import { useGetCategories, useGetAllFoodItems } from '../../hooks/useQueries';
import {
  useAddFoodItem,
  useUpdateFoodItem,
  useUpdateFoodItemImage,
  useToggleFoodItemEnabled,
  useDeleteFoodItem,
} from '../../hooks/useAdminMutations';
import AdminLayout from '../../components/admin/AdminLayout';
import FoodItemForm from '../../components/admin/FoodItemForm';
import { RequestState } from '../../components/state/RequestState';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../../utils/format';
import type { FoodItem, CategoryId } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function FoodItemsPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();
  const { data: allItems = [], isLoading: itemsLoading, error } = useGetAllFoodItems();
  const addItem = useAddFoodItem();
  const updateItem = useUpdateFoodItem();
  const updateImage = useUpdateFoodItemImage();
  const toggleEnabled = useToggleFoodItemEnabled();
  const deleteItem = useDeleteFoodItem();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);

  const filteredItems = filterCategory === 'all'
    ? allItems
    : allItems.filter((item) => item.categoryId === filterCategory);

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: FoodItem) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    price: number;
    hot: boolean;
    categoryId: CategoryId;
    image: ExternalBlob | null;
  }) => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          name: data.name,
          description: data.description,
          price: data.price,
          hot: data.hot,
          categoryId: data.categoryId,
        });
        
        // Update image if changed
        if (data.image !== editingItem.image) {
          await updateImage.mutateAsync({
            id: editingItem.id,
            image: data.image,
          });
        }
        
        toast.success('Item updated successfully');
      } else {
        const order = BigInt(allItems.length);
        const itemId = await addItem.mutateAsync({
          name: data.name,
          description: data.description,
          price: data.price,
          hot: data.hot,
          categoryId: data.categoryId,
          order,
        });
        
        // Add image if provided
        if (data.image) {
          await updateImage.mutateAsync({
            id: itemId,
            image: data.image,
          });
        }
        
        toast.success('Item added successfully');
      }
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    
    try {
      await deleteItem.mutateAsync(deletingItem.id);
      toast.success('Item deleted successfully');
      setDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const handleToggle = async (item: FoodItem) => {
    try {
      await toggleEnabled.mutateAsync({ id: item.id, enabled: !item.enabled });
      toast.success(`Item ${!item.enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update item');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId;
  };

  const isLoading = categoriesLoading || itemsLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Food Items</h2>
            <p className="text-muted-foreground mt-1">Manage your menu items</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filter by category:</span>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <RequestState
          isLoading={isLoading}
          error={error}
          isEmpty={filteredItems.length === 0}
          emptyMessage={
            filterCategory === 'all'
              ? 'No items yet. Add your first menu item to get started.'
              : 'No items in this category.'
          }
        >
          <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                    <TableCell>{formatINR(item.price)}</TableCell>
                    <TableCell>{item.hot ? 'Hot' : 'Cold'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={() => handleToggle(item)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </RequestState>
      </div>

      <FoodItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        categories={categories}
        onSave={handleSave}
        isPending={addItem.isPending || updateItem.isPending || updateImage.isPending}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItem.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteItem.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
