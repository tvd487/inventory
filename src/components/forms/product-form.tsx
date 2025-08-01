'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productSchema, ProductFormData } from '@/lib/validations/inventory';
import { Product, Category, Supplier } from '@/types/inventory';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({
  product,
  categories,
  suppliers,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      sku: product.sku,
      barcode: product.barcode || '',
      price: product.price,
      cost: product.cost || undefined,
      quantity: product.quantity,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity || undefined,
      status: product.status,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
    } : {
      status: 'ACTIVE',
      quantity: 0,
      minQuantity: 0,
    },
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Product name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            {...register('sku')}
            placeholder="Stock keeping unit"
          />
          {errors.sku && (
            <p className="text-sm text-destructive">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            {...register('barcode')}
            placeholder="Product barcode"
          />
          {errors.barcode && (
            <p className="text-sm text-destructive">{errors.barcode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            {...register('cost', { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.cost && (
            <p className="text-sm text-destructive">{errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minQuantity">Minimum Quantity *</Label>
          <Input
            id="minQuantity"
            type="number"
            {...register('minQuantity', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.minQuantity && (
            <p className="text-sm text-destructive">{errors.minQuantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxQuantity">Maximum Quantity</Label>
          <Input
            id="maxQuantity"
            type="number"
            {...register('maxQuantity', { valueAsNumber: true })}
            placeholder="Optional"
          />
          {errors.maxQuantity && (
            <p className="text-sm text-destructive">{errors.maxQuantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={watch('categoryId')?.toString() || ''}
            onValueChange={(value) => setValue('categoryId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierId">Supplier *</Label>
          <Select
            value={watch('supplierId')?.toString() || ''}
            onValueChange={(value) => setValue('supplierId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplierId && (
            <p className="text-sm text-destructive">{errors.supplierId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Product description"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
} 