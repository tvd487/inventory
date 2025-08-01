import { z } from 'zod';

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>

// Supplier schemas
export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be less than 50 characters'),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  cost: z.number().min(0, 'Cost must be positive').optional(),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  minQuantity: z.number().int().min(0, 'Minimum quantity must be non-negative'),
  maxQuantity: z.number().int().min(0, 'Maximum quantity must be non-negative').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']),
  categoryId: z.number().int().min(1, 'Category is required'),
  supplierId: z.number().int().min(1, 'Supplier is required'),
});

export type ProductFormData = z.infer<typeof productSchema>
