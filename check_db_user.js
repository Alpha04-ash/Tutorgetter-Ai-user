
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const questions = await prisma.question.findMany({
            where: { categoryId: 1 }
        });
        console.log(`[UserPortal Check] Found ${questions.length} questions for Category 1.`);
    } catch (e) {
        console.error(e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
