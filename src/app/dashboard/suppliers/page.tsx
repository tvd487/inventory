'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { SupplierForm } from '@/components/forms/supplier-form';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '@/lib/hooks/useInventory';
import { Supplier } from '@/types/inventory';
import { Truck, Plus } from 'lucide-react';

export default function SuppliersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

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

  const handleCreateSupplier = (data: any) => {
    createSupplier.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setEditingSupplier(null);
      },
    });
  };

  const handleUpdateSupplier = (data: any) => {
    if (editingSupplier) {
      updateSupplier.mutate({ ...data, id: editingSupplier.id }, {
        onSuccess: () => {
          setShowForm(false);
          setEditingSupplier(null);
        },
      });
    }
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    if (confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      deleteSupplier.mutate(supplier.id);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'website', label: 'Website', sortable: true },
    { 
      key: 'createdAt', 
      label: 'Created', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'updatedAt', 
      label: 'Updated', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {editingSupplier ? 'Edit Supplier' : 'Create Supplier'}
            </h1>
            <Button onClick={() => setShowForm(false)} variant="outline">
              Back to Suppliers
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Supplier Details</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierForm
                supplier={editingSupplier || undefined}
                onSubmit={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
                onCancel={() => setShowForm(false)}
                loading={createSupplier.isPending || updateSupplier.isPending}
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
            <Truck className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Suppliers</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        <DataTable
          title="Suppliers"
          data={suppliers}
          columns={columns}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
          loading={suppliersLoading}
          searchPlaceholder="Search suppliers..."
        />
      </div>
    </div>
  );
} 