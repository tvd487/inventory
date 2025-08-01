'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { SupplierForm } from '@/components/forms/supplier-form';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateSupplier, useDeleteSupplier, useSuppliers, useUpdateSupplier } from '@/lib/hooks/useInventory';
import { Supplier } from '@/types/inventory';
import { Plus } from 'lucide-react';

export default function SuppliersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    supplier: Supplier | null;
  }>({
    isOpen: false,
    supplier: null,
  });

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
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleCreateSupplier = (data: any) => {
    createSupplier.mutate(data, {
      onSuccess: () => {
        setShowSupplierDialog(false);
        setEditingSupplier(null);
      },
    });
  };

  const handleUpdateSupplier = (data: any) => {
    if (editingSupplier) {
      updateSupplier.mutate({ ...data, id: editingSupplier.id }, {
        onSuccess: () => {
          setShowSupplierDialog(false);
          setEditingSupplier(null);
        },
      });
    }
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeleteDialog({
      isOpen: true,
      supplier,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.supplier) {
      deleteSupplier.mutate(deleteDialog.supplier.id, {
        onSuccess: () => {
          setDeleteDialog({ isOpen: false, supplier: null });
        },
      });
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowSupplierDialog(true);
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowSupplierDialog(true);
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
            <h1 className="text-3xl font-bold">Suppliers</h1>
            <p className="text-muted-foreground mt-2">
              Manage your product suppliers and vendor information.
            </p>
          </div>
          <Button onClick={handleAddSupplier}>
            <Plus className="h-4 w-4 mr-2"/>
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

      {/* Supplier Form Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Edit Supplier' : 'Create Supplier'}
            </DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={editingSupplier || undefined}
            onSubmit={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
            onCancel={() => setShowSupplierDialog(false)}
            loading={createSupplier.isPending || updateSupplier.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, supplier: null })}
        onConfirm={confirmDelete}
        title="Delete Supplier"
        description="Are you sure you want to delete"
        itemName={deleteDialog.supplier?.name}
        loading={deleteSupplier.isPending}
      />
    </div>
  );
}
