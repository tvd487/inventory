'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ProductFormData, productSchema} from '@/lib/validations/inventory';
import {Category, Product, Supplier} from '@/types/inventory';
import {formatCategoryName} from '@/lib/utils';

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
    formState: {errors},
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
      quantity: 1,
      minQuantity: 1,
    },
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Tên *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Tên sản phẩm"
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
            placeholder="Mã sản phẩm"
          />
          {errors.sku && (
            <p className="text-sm text-destructive">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Mã vạch</Label>
          <Input
            id="barcode"
            {...register('barcode')}
            placeholder="Mã vạch sản phẩm"
          />
          {errors.barcode && (
            <p className="text-sm text-destructive">{errors.barcode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Giá *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              setValueAs: (value) => {
                if (!value || value === '') return 0;
                const num = parseFloat(value);
                return isNaN(num) ? 0 : num;
              }
            })}
            placeholder="0.00 ₫"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Chi phí</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            {...register('cost', {
                setValueAs: (value) => {
                  if (!value || value === '') return undefined;
                  const num = parseFloat(value);
                  return isNaN(num) ? undefined : num;
                }
              }
            )}
            placeholder="0.00 ₫"
          />
          {errors.cost && (
            <p className="text-sm text-destructive">{errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Số lượng *</Label>
          <Input
            id="quantity"
            type="number"
            step="1"
            {...register('quantity', {
              setValueAs: (value) => {
                if (!value) return 1;
                const num = parseInt(value);
                return isNaN(num) ? 1 : num;
              }
            })}
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minQuantity">Số lượng tối thiểu *</Label>
          <Input
            id="minQuantity"
            type="number"
            {...register('minQuantity', {
              setValueAs: (value) => {
                if (!value) return 1;
                const num = parseInt(value);
                return isNaN(num) ? 1 : num;
              }
            })}
            placeholder="0"
          />
          {errors.minQuantity && (
            <p className="text-sm text-destructive">{errors.minQuantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxQuantity">Số lượng tối đa</Label>
          <Input
            id="maxQuantity"
            type="number"
            min="0"
            {...register('maxQuantity', {
              setValueAs: (value) => {
                if (!value) return 0;
                const num = parseInt(value);
                return isNaN(num) ? 0 : num;
              }
            })}
            placeholder="Tùy chọn"
          />
          {errors.maxQuantity && (
            <p className="text-sm text-destructive">{errors.maxQuantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              <SelectItem value="DISCONTINUED">Ngừng kinh doanh</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Danh mục *</Label>
          <Select
            value={watch('categoryId')?.toString() || ''}
            onValueChange={(value) => {
              setValue('categoryId', value ? parseInt(value) : 0);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục"/>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {formatCategoryName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierId">Nhà cung cấp *</Label>
          <Select
            value={watch('supplierId')?.toString() || '0'}
            onValueChange={(value) => setValue('supplierId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhà cung cấp"/>
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
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Mô tả sản phẩm"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : product ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
        </Button>
      </div>
    </form>
  );
}
