import {z} from 'zod';

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(255, 'Tên sản phẩm không được vượt quá 255 ký tự'),
  description: z.string().optional(),
  sku: z.string()
    .min(1, 'Mã SKU là bắt buộc')
    .max(50, 'Mã SKU không được vượt quá 50 ký tự'),
  barcode: z.string().optional(),
  price: z.number()
    .refine(val => val !== undefined, {
      message: "Giá sản phẩm là bắt buộc"
    })
    .refine(val => val === undefined || val > 0, {
      message: "Giá sản phẩm là bắt buộc"
    }),
  cost: z.number()
    .optional()
    .refine(val => val === undefined || val > 0, {
      message: "Chi phí sản phẩm không hợp lệ"
    }),
  quantity: z.number()
    .min(1, 'Số lượng phải lớn hơn hoặc bằng 1')
    .refine((val) => !isNaN(val), {
      message: 'Số lượng không hợp lệ'
    }),
  minQuantity: z.number()
    .min(1, 'Số lượng tối thiểu phải lớn hơn hoặc bằng 1')
    .refine((val) => !isNaN(val), {
      message: 'Số lượng tối thiểu không hợp lệ'
    }),
  maxQuantity: z.union([
    z.number()
      .int('Số lượng tối đa phải là số nguyên')
      .min(0, 'Số lượng tối đa phải lớn hơn hoặc bằng 0')
      .refine((val) => !isNaN(val), {
        message: 'Số lượng tối đa không hợp lệ'
      }),
    z.undefined(),
    z.null()
  ]).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']),
  categoryId: z.number()
    .optional()
    .refine(val => val !== undefined, {
      message: "Danh mục là bắt buộc"
    })
    .refine(val => val === undefined || val > 0, {
      message: "Danh mục phải lớn hơn 0"
    }),
  supplierId: z.number()
    .refine(val => val !== undefined, {
      message: "Nhà cung cấp là bắt buộc"
    })
    .refine(val => val === undefined || val > 0, {
      message: "Nhà cung cấp phải lớn hơn 0"
    }),
});

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  description: z.string().optional(),
  parentId: z.union([
    z.number().int('ID danh mục cha phải là số nguyên').positive('ID danh mục cha phải là số dương'),
    z.null(),
    z.undefined()
  ]).optional(),
});

export const supplierSchema = z.object({
  name: z.string()
    .min(1, 'Tên nhà cung cấp là bắt buộc')
    .max(255, 'Tên nhà cung cấp không được vượt quá 255 ký tự'),
  email: z.string()
    .email('Định dạng email không hợp lệ')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string()
    .url('URL website không hợp lệ')
    .optional()
    .or(z.literal('')),
  notes: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
