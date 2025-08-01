import api from '@/lib/axios';
import {
  Product,
  Category,
  Supplier,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest
} from '@/types/inventory';

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.products;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (data: UpdateProductRequest): Promise<Product> => {
    const response = await api.put(`/products/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.put(`/categories/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Suppliers API
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  update: async (data: UpdateSupplierRequest): Promise<Supplier> => {
    const response = await api.put(`/suppliers/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
