'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categorySchema, CategoryFormData } from '@/lib/validations/inventory';
import { Category } from '@/types/inventory';

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CategoryForm({
  category,
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
      parentId: category.parentId,
    } : {
      parentId: null,
    },
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Tên *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Tên danh mục"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Mô tả danh mục"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Danh mục cha</Label>
        <Select
          value={watch('parentId')?.toString() || 'none'}
          onValueChange={(value) => setValue('parentId', value === 'none' ? null : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không có danh mục cha</SelectItem>
            {categories
              .filter(cat => !category || cat.id !== category.id) // Exclude current category from parent options
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.parentId && (
          <p className="text-sm text-destructive">{errors.parentId.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : category ? 'Cập nhật danh mục' : 'Tạo danh mục'}
        </Button>
      </div>
    </form>
  );
} 