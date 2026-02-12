import AssessmentFlow from '../../../../components/AssessmentFlow';
import styles from '../../user.module.css';

interface PageProps {
    params: Promise<{ categoryId: string }>;
}

async function getQuestions(categoryId: string) {
    try {
        console.log(`Fetching questions for category ${categoryId}...`);
        const res = await fetch(`http://localhost:3001/api/categories/${categoryId}/questions`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Fetch failed with status: ${res.status}`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

export default async function AssessmentPage({ params }: PageProps) {
    const { categoryId } = await params;
    const questions = await getQuestions(categoryId);

    return (
        <AssessmentFlow categoryId={parseInt(categoryId)} questions={questions} />
    );
}
