import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeTextAnswers, calculateFinalDecision } from '@/lib/ai/analysis';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const userId = formData.get('userId');
        const categoryId = formData.get('categoryId');
        const answersJson = formData.get('answersJson');
        const videoFile = formData.get('videoFile') as File | null;

        if (!userId || !categoryId || !answersJson) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Save Video
        let videoFilename = "";
        if (videoFile) {
            const bytes = await videoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure 'uploads' directory exists
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (e) { }

            const ext = videoFile.name.split('.').pop() || 'webm';
            videoFilename = `assessment_${userId}_${categoryId}_${Date.now()}.${ext}`;
            const filePath = join(uploadDir, videoFilename);

            await writeFile(filePath, buffer);
        }

        // Create Assessment
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId.toString()) }
        });

        const assessment = await prisma.assessment.create({
            data: {
                userId: parseInt(userId.toString()),
                categoryId: parseInt(categoryId.toString()),
                status: 'completed',
                videoUrl: videoFilename,
                candidateNameSnapshot: user?.fullName || "Unknown Candidate"
            }
        });

        // Save Answers
        const answersData = JSON.parse(answersJson.toString());

        // We need to create answers. 
        // Note: If questions were ephemeral (negative ID), we might have an issue linking them.
        // For this migration, we assume we only save text and link to question if valid ID > 0.
        // If ID is negative (AI generated ephemeral), we might need to create the question first OR just store text.
        // Our Schema enforces Question relation.
        // FIX: If Question ID is not found (ephemeral), create the question on the fly?
        // OR: Real backend approach: Identify question text and find/create.

        // Let's iterate and check.
        for (const ans of answersData) {
            let qId = ans.questionId;

            if (qId < 0) {
                // Ephemeral AI question. Create it so we can link answer.
                const newQ = await prisma.question.create({
                    data: {
                        categoryId: parseInt(categoryId.toString()),
                        text: ans.text_question_content || "AI Generated Question", // Frontend should pass text
                        source: 'AI',
                        type: 'THEORY'
                    }
                });
                qId = newQ.id;
            }

            await prisma.answer.create({
                data: {
                    assessmentId: assessment.id,
                    questionId: qId,
                    answerText: ans.text
                }
            });
        }

        // Run Analysis
        const fullAssessment = await prisma.assessment.findUnique({
            where: { id: assessment.id },
            include: { answers: { include: { question: true } } }
        });

        if (fullAssessment) {
            const results = analyzeTextAnswers(fullAssessment.answers);

            const decision = calculateFinalDecision(
                results.technical_score,
                results.communication_score,
                results.teaching_score
            );

            await prisma.assessment.update({
                where: { id: assessment.id },
                data: {
                    technicalScore: results.technical_score,
                    communicationScore: results.communication_score,
                    teachingScore: results.teaching_score,
                    finalScore: (results.technical_score + results.communication_score + results.teaching_score) / 3,
                    decision: decision
                }
            });

            // Update answers with feedback
            for (const ans of fullAssessment.answers) {
                if (results.feedback_map[String(ans.questionId)]) {
                    const feedback = results.feedback_map[String(ans.questionId)];
                    // Update feedback. Store as JSON string as per schema comment, but field is String type.
                    await prisma.answer.update({
                        where: { id: ans.id },
                        data: { aiFeedback: JSON.stringify({ notes: feedback }) }
                    });
                }
            }
        }

        return NextResponse.json({ status: 'success', assessmentId: assessment.id });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
    }
}
