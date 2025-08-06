import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create permissions (existing code)
  console.log('📝 Creating permissions...');
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'user:read' },
      update: {},
      create: { name: 'user:read', description: 'Read user information' },
    }),
    prisma.permission.upsert({
      where: { name: 'user:write' },
      update: {},
      create: { name: 'user:write', description: 'Create and update users' },
    }),
    prisma.permission.upsert({
      where: { name: 'user:delete' },
      update: {},
      create: { name: 'user:delete', description: 'Delete users' },
    }),
    prisma.permission.upsert({
      where: { name: 'admin:access' },
      update: {},
      create: { name: 'admin:access', description: 'Access admin panel' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:read' },
      update: {},
      create: { name: 'inventory:read', description: 'Read inventory data' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:write' },
      update: {},
      create: { name: 'inventory:write', description: 'Create and update inventory' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:delete' },
      update: {},
      create: { name: 'inventory:delete', description: 'Delete inventory items' },
    }),
  ]);

  // Create users (existing code with admin user)
  console.log('👤 Creating users...');
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      name: 'System Administrator',
      password: await bcrypt.hash('tvLogistics@2025', 12),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // Create categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Electronic devices and components',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: {
        name: 'Clothing',
        description: 'Apparel and fashion items',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Books' },
      update: {},
      create: {
        name: 'Books',
        description: 'Books and educational materials',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Home & Garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
      },
    }),
  ]);

  // Create subcategories
  console.log('📂 Creating subcategories...');
  const subcategories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Computers' },
      update: {},
      create: {
        name: 'Computers',
        description: 'Desktop and laptop computers',
        parentId: categories[0].id, // Electronics
      },
    }),
    prisma.category.upsert({
      where: { name: 'Mobile Phones' },
      update: {},
      create: {
        name: 'Mobile Phones',
        description: 'Smartphones and mobile devices',
        parentId: categories[0].id, // Electronics
      },
    }),
    prisma.category.upsert({
      where: { name: 'Men\'s Clothing' },
      update: {},
      create: {
        name: 'Men\'s Clothing',
        description: 'Clothing for men',
        parentId: categories[1].id, // Clothing
      },
    }),
    prisma.category.upsert({
      where: { name: 'Women\'s Clothing' },
      update: {},
      create: {
        name: 'Women\'s Clothing',
        description: 'Clothing for women',
        parentId: categories[1].id, // Clothing
      },
    }),
    prisma.category.upsert({
      where: { name: 'Programming Books' },
      update: {},
      create: {
        name: 'Programming Books',
        description: 'Books about programming and software development',
        parentId: categories[2].id, // Books
      },
    }),
  ]);

  // Create suppliers
  console.log('🏪 Creating suppliers...');
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { name: 'Tech Solutions Ltd' },
      update: {},
      create: {
        name: 'Tech Solutions Ltd',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, Silicon Valley, CA 94000',
        contactPerson: 'John Smith',
        website: 'https://techsolutions.com',
      },
    }),
    prisma.supplier.upsert({
      where: { name: 'Fashion Forward Inc' },
      update: {},
      create: {
        name: 'Fashion Forward Inc',
        email: 'orders@fashionforward.com',
        phone: '+1-555-0456',
        address: '456 Fashion Ave, New York, NY 10001',
        contactPerson: 'Sarah Johnson',
        website: 'https://fashionforward.com',
      },
    }),
    prisma.supplier.upsert({
      where: { name: 'Book Distributors Co' },
      update: {},
      create: {
        name: 'Book Distributors Co',
        email: 'sales@bookdist.com',
        phone: '+1-555-0789',
        address: '789 Library Lane, Boston, MA 02101',
        contactPerson: 'Mike Wilson',
      },
    }),
  ]);

  // Create products
  console.log('📦 Creating products...');
  const products = [
    {
      name: 'Laptop Computer',
      description: 'High-performance laptop for business use',
      sku: 'LAPTOP-001',
      barcode: '1234567890123',
      price: 999.99,
      cost: 750.00,
      quantity: 25,
      minQuantity: 5,
      categoryId: categories[0].id, // Electronics
      supplierId: suppliers[0].id,
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with USB receiver',
      sku: 'MOUSE-001',
      barcode: '1234567890124',
      price: 29.99,
      cost: 15.00,
      quantity: 100,
      minQuantity: 20,
      categoryId: categories[0].id, // Electronics
      supplierId: suppliers[0].id,
    },
    {
      name: 'Cotton T-Shirt',
      description: '100% cotton comfortable t-shirt',
      sku: 'TSHIRT-001',
      barcode: '1234567890125',
      price: 19.99,
      cost: 8.00,
      quantity: 50,
      minQuantity: 10,
      categoryId: categories[1].id, // Clothing
      supplierId: suppliers[1].id,
    },
    {
      name: 'Programming Book',
      description: 'Complete guide to modern programming',
      sku: 'BOOK-001',
      barcode: '1234567890126',
      price: 49.99,
      cost: 25.00,
      quantity: 30,
      minQuantity: 5,
      categoryId: categories[2].id, // Books
      supplierId: suppliers[2].id,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Sample data created:');
  console.log('- 4 Categories');
  console.log('- 3 Suppliers');
  console.log('- 4 Products');
  console.log('- Admin user: admin / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
