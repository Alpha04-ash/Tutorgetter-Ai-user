import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.hashedPassword !== password) {
            // Simple comparison for migration proof-of-concept
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const { hashedPassword: _, ...userWithoutPass } = user;
        return NextResponse.json(userWithoutPass);
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
