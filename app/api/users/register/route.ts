import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, phoneNumber } = body;

        // Password is optional for candidate registration (auto-generated)
        // If not provided, we generate a random one to satisfy the DB constraint
        const finalPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check existing
        const existing = await prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // In a real app, hash the password here (e.g., bcrypt)
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(finalPassword, 10);

        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                fullName,
                phoneNumber,
            },
        });

        // Return user without password
        const { hashedPassword: _, ...userWithoutPass } = user;
        return NextResponse.json(userWithoutPass);
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
