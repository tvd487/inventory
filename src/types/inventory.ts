export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost?: number;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  categoryId: number;
  supplierId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost?: number;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  categoryId: number;
  supplierId: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

export interface CreateSupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  notes?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: number;
} 