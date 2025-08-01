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
import { useProducts, useCategories, useSuppliers, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks/useInventory';
import { Product, Category, Supplier } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Trash2, Plus } from 'lucide-react';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);

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
        setShowForm(false);
        setEditingProduct(null);
      },
    });
  };

  const handleUpdateProduct = (data: any) => {
    if (editingProduct) {
      updateProduct.mutate({ ...data, id: editingProduct.id }, {
        onSuccess: () => {
          setShowForm(false);
          setEditingProduct(null);
        },
      });
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct.mutate(product.id);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
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

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </h1>
            <Button onClick={() => setShowForm(false)} variant="outline">
              Back to Products
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={editingProduct || undefined}
                categories={categories}
                suppliers={suppliers}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={() => setShowForm(false)}
                loading={createProduct.isPending || updateProduct.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Products</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowCategoryForm(true)} variant="outline">
              Manage Categories
            </Button>
            <Button onClick={() => setShowSupplierForm(true)} variant="outline">
              Manage Suppliers
            </Button>
            <Button onClick={() => setShowForm(true)}>
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

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
            <CategoryForm
              onSubmit={() => {}}
              onCancel={() => setShowCategoryForm(false)}
            />
          </div>
        </div>
      )}

      {/* Supplier Form Modal */}
      {showSupplierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Manage Suppliers</h2>
            <SupplierForm
              onSubmit={() => {}}
              onCancel={() => setShowSupplierForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
