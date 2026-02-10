import { useState } from 'react';
import { useGetCategories } from '../../hooks/useQueries';
import { useAddCategory, useUpdateCategory, useToggleCategoryEnabled, useDeleteCategory } from '../../hooks/useAdminMutations';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryFormDialog from '../../components/admin/CategoryFormDialog';
import DeleteCategoryDialog from '../../components/admin/DeleteCategoryDialog';
import { RequestState } from '../../components/state/RequestState';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '../../backend';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, error } = useGetCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const toggleEnabled = useToggleCategoryEnabled();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteOpen(true);
  };

  const handleSave = async (name: string) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, name });
        toast.success('Category updated successfully');
      } else {
        const order = BigInt(categories.length);
        await addCategory.mutateAsync({ name, order });
        toast.success('Category added successfully');
      }
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      toast.success('Category deleted successfully');
      setDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleToggle = async (category: Category) => {
    try {
      await toggleEnabled.mutateAsync({ id: category.id, enabled: !category.enabled });
      toast.success(`Category ${!category.enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Categories</h2>
            <p className="text-muted-foreground mt-1">Manage your menu categories</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <RequestState
          isLoading={isLoading}
          error={error}
          isEmpty={categories.length === 0}
          emptyMessage="No categories yet. Add your first category to get started."
        >
          <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{Number(category.order) + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.enabled}
                          onCheckedChange={() => handleToggle(category)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {category.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
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

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSave={handleSave}
        isPending={addCategory.isPending || updateCategory.isPending}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
        isPending={deleteCategory.isPending}
      />
    </AdminLayout>
  );
}
