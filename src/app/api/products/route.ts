import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import {authOptions} from "@/lib/auth/authOptions";
import {productSchema} from "@/lib/validations/inventory";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const supplierId = searchParams.get('supplierId');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (supplierId) {
      where.supplierId = parseInt(supplierId);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          category: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Validate that required fields are not undefined
    if (validatedData.price === undefined) {
      return NextResponse.json({ error: 'Giá sản phẩm là bắt buộc' }, { status: 400 });
    }
    if (validatedData.categoryId === undefined) {
      return NextResponse.json({ error: 'Danh mục là bắt buộc' }, { status: 400 });
    }
    if (validatedData.supplierId === undefined) {
      return NextResponse.json({ error: 'Nhà cung cấp là bắt buộc' }, { status: 400 });
    }

    // Create product data with guaranteed non-undefined required fields
    const productData = {
      ...validatedData,
      price: validatedData.price as number,
      categoryId: validatedData.categoryId as number,
      supplierId: validatedData.supplierId as number,
    };

    const product = await prisma.product.create({
      data: productData,
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'SKU or barcode already exists' }, { status: 400 });
    }
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
