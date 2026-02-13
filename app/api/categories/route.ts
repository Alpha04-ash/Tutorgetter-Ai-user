import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("Categories API Error:", error);
        return NextResponse.json({
            error: 'Failed to fetch categories',
            details: error.message
        }, { status: 500 });
    }
}
