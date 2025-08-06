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
import { Card, CardContent } from '@/components/ui/card';
import { CategoryTreeItem } from '@/components/category-tree-item';
import { buildCategoryTree, formatCategoryName } from '@/lib/utils';

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
    return <div className="flex items-center justify-center h-full">Đang tải...</div>;
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
    { key: 'name', label: 'Tên', sortable: true },
    { key: 'description', label: 'Mô tả', sortable: true },
    {
      key: 'parentId',
      label: 'Danh mục cha',
      sortable: true,
      render: (value: number | null, row: Category) => {
        if (!value) return '-';
        const parent = categories.find(c => c.id === value);
        return parent?.name || '-';
      },
    },
    {
      key: 'children',
      label: 'Danh mục con',
      sortable: false,
      render: (value: Category[], row: Category) => {
        if (!row.children || row.children.length === 0) return '-';
        return row.children.map(child => child.name).join(', ');
      },
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      key: 'updatedAt',
      label: 'Ngày cập nhật',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  // Build hierarchical tree for display
  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Danh mục</h1>
            <p className="text-muted-foreground mt-2">
              Tổ chức sản phẩm theo danh mục để quản lý kho hàng tốt hơn.
            </p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2"/>
            Thêm danh mục
          </Button>
        </div>

        {/* Hierarchical Category Tree */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cấu trúc danh mục</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                {categoryTree.map((category) => (
                  <CategoryTreeItem 
                    key={category.id} 
                    category={category} 
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Danh mục"
          data={categories}
          columns={columns}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          loading={categoriesLoading}
          searchPlaceholder="Tìm kiếm danh mục..."
        />
      </div>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory || undefined}
            categories={categories}
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
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa"
        itemName={deleteDialog.category?.name}
        loading={deleteCategory.isPending}
      />
    </div>
  );
}
