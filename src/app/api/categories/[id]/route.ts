import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations/inventory';
import { getServerSession } from 'next-auth';
import {authOptions} from "@/lib/auth/authOptions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Promise<{ id: string }>> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        products: {
          select: { id: true, name: true, sku: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Category GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Promise<{ id: string }>> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Prevent circular references
    if (validatedData.parentId && validatedData.parentId === parseInt((await params).id)) {
      return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 });
    }

    // Check if parent exists (only if parentId is provided and not null/undefined)
    if (validatedData.parentId !== null && validatedData.parentId !== undefined) {
      const parentExists = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });
      if (!parentExists) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt((await params).id) },
      data: validatedData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    console.error('Category PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Promise<{ id: string }>> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: parseInt((await params).id) },
    });

    if (productsCount > 0) {
      return NextResponse.json({
        error: 'Cannot delete category with existing products',
      }, { status: 400 });
    }

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: parseInt((await params).id) },
    });

    if (childrenCount > 0) {
      return NextResponse.json({
        error: 'Cannot delete category with existing subcategories',
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: parseInt((await params).id) },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
