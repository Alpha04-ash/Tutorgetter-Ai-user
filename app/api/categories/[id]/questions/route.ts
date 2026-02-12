import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQuestions } from '@/lib/ai/generator';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params
    const categoryId = parseInt(id)


    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { questions: true }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Existing questions (Admin created)
        const existing = category.questions.map(q => q.text);

        // Check if we need to generate more (simplified logic: always return admin questions + optional generated)
        // The previous backend logic: generate_questions(category_name, existing_questions, count, type_instruction)

        // For this endpoint, existing frontend expects a list of questions.
        // We will combine DB questions with AI questions if DB is empty or requested.

        // Simplification: Return existing DB questions. If empty, generate some on the fly and SAVE them? 
        // Or just return them ephemeral?
        // The old backend generated them but didn't save them to DB immediately, it seemed to just return strings?
        // Actually the frontend displayed them. 
        // Let's generate 5 questions if none exist in DB.
        let finalQuestions = category.questions;
        console.log(`[Questions API] Category ${categoryId} has ${finalQuestions.length} questions.`);

        if (finalQuestions.length < 5) {
            console.log(`[Questions API] Generating questions for category ${categoryId}...`);
            // Generate and SAVE questions so they persist
            const generatedTexts = generateQuestions(category.name, existing, 5 - finalQuestions.length);

            if (generatedTexts.length > 0) {
                console.log(`[Questions API] Saving ${generatedTexts.length} generated questions...`);
                await prisma.question.createMany({
                    data: generatedTexts.map(text => ({
                        categoryId,
                        text,
                        source: 'AI',
                        type: 'THEORY'
                    }))
                });

                // Re-fetch to get the questions with their new real IDs
                const updatedCategory = await prisma.question.findMany({
                    where: { categoryId }
                });
                console.log(`[Questions API] Questions saved. New count: ${updatedCategory.length}`);
                finalQuestions = updatedCategory;
            }
        } else {
            console.log(`[Questions API] Sufficient questions exist. Skipping generation.`);
        }

        return NextResponse.json(finalQuestions);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
