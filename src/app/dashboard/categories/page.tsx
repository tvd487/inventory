'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { CategoryForm } from '@/components/forms/category-form';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/lib/hooks/useInventory';
import { Category } from '@/types/inventory';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleCreateCategory = (data: any) => {
    createCategory.mutate(data, {
      onSuccess: () => {
        setShowCategoryDialog(false);
        setEditingCategory(null);
      },
    });
  };

  const handleUpdateCategory = (data: any) => {
    if (editingCategory) {
      updateCategory.mutate({ ...data, id: editingCategory.id }, {
        onSuccess: () => {
          setShowCategoryDialog(false);
          setEditingCategory(null);
        },
      });
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteDialog({
      isOpen: true,
      category,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.category) {
      deleteCategory.mutate(deleteDialog.category.id, {
        onSuccess: () => {
          setDeleteDialog({ isOpen: false, category: null });
        },
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryDialog(true);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground mt-2">
              Organize your products by categories for better inventory management.
            </p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2"/>
            Add Category
          </Button>
        </div>

        <DataTable
          title="Categories"
          data={categories}
          columns={columns}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          loading={categoriesLoading}
          searchPlaceholder="Search categories..."
        />
      </div>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory || undefined}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            onCancel={() => setShowCategoryDialog(false)}
            loading={createCategory.isPending || updateCategory.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, category: null })}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete"
        itemName={deleteDialog.category?.name}
        loading={deleteCategory.isPending}
      />
    </div>
  );
}
