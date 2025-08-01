'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ProductForm } from '@/components/forms/product-form';
import { CategoryForm } from '@/components/forms/category-form';
import { SupplierForm } from '@/components/forms/supplier-form';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts, useCategories, useSuppliers, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks/useInventory';
import { Product, Category, Supplier } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Trash2, Plus } from 'lucide-react';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleCreateProduct = (data: any) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        setShowProductDialog(false);
        setEditingProduct(null);
      },
    });
  };

  const handleUpdateProduct = (data: any) => {
    if (editingProduct) {
      updateProduct.mutate({ ...data, id: editingProduct.id }, {
        onSuccess: () => {
          setShowProductDialog(false);
          setEditingProduct(null);
        },
      });
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteDialog({
      isOpen: true,
      product,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.product) {
      deleteProduct.mutate(deleteDialog.product.id, {
        onSuccess: () => {
          setDeleteDialog({ isOpen: false, product: null });
        },
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductDialog(true);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number) => `$${value}`
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      render: (value: number, row: Product) => {
        const isLow = value <= row.minQuantity;
        return (
          <Badge variant={isLow ? 'destructive' : 'default'}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'ACTIVE' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'categoryId',
      label: 'Category',
      sortable: true,
      render: (value: number) => {
        const category = categories.find(c => c.id === value);
        return category?.name || '-';
      }
    },
    {
      key: 'supplierId',
      label: 'Supplier',
      sortable: true,
      render: (value: number) => {
        const supplier = suppliers.find(s => s.id === value);
        return supplier?.name || '-';
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Products</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowCategoryDialog(true)} variant="outline">
              Manage Categories
            </Button>
            <Button onClick={() => setShowSupplierDialog(true)} variant="outline">
              Manage Suppliers
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <DataTable
          title="Products"
          data={products}
          columns={columns}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          loading={productsLoading}
          searchPlaceholder="Search products..."
        />
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            categories={categories}
            suppliers={suppliers}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={() => setShowProductDialog(false)}
            loading={createProduct.isPending || updateProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={() => {}}
            onCancel={() => setShowCategoryDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Supplier Form Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Suppliers</DialogTitle>
          </DialogHeader>
          <SupplierForm
            onSubmit={() => {}}
            onCancel={() => setShowSupplierDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete"
        itemName={deleteDialog.product?.name}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
