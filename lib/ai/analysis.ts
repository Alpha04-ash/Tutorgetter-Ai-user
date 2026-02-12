
interface Answer {
    questionId: number;
    answerText: string;
    question?: {
        type: string;
    };
}

interface AnalysisResult {
    technical_score: number;
    communication_score: number;
    teaching_score: number;
    feedback_map: Record<string, string>;
}

const keywords = ["python", "variable", "function", "class", "object", "api", "rest", "database", "sql", "react", "component", "state", "props", "hook", "dom", "html", "css", "async", "await", "promise"];

export function analyzeTextAnswers(answers: Answer[]): AnalysisResult {
    const codeScores: number[] = [];
    const theoryScores: number[] = [];
    const teachingScores: number[] = [];
    const feedbackMap: Record<string, string> = {};

    answers.forEach((ans) => {
        const text = ans.answerText.toLowerCase();
        const qType = ans.question?.type || "THEORY";

        // Basic Scoring logic
        const matches = keywords.filter(k => text.includes(k));
        let score = 0;
        let critique = "";

        if (text.length < 5 || ["no", "idk", "skip", "pass"].includes(text)) {
            score = 0;
            critique = "No substantive answer provided.";
        } else {
            let base = 40;
            if (text.length > 100) base += 20;
            if (matches.length > 0) base += (matches.length * 10);
            score = Math.min(base, 100);
            critique = `Answer accepted. Key terms found: ${matches.length}.`;
        }

        if (qType.includes("CODE")) {
            codeScores.push(score);
        } else if (qType.includes("TEACHING")) {
            teachingScores.push(score);
        } else {
            theoryScores.push(score);
        }

        feedbackMap[String(ans.questionId)] = `**Critique:** ${critique} (Score: ${score}/100)`;
    });

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
        technical_score: Number(avg(codeScores).toFixed(1)),
        communication_score: Number(avg(theoryScores).toFixed(1)),
        teaching_score: Number(avg(teachingScores).toFixed(1)),
        feedback_map: feedbackMap
    };
}

export function calculateFinalDecision(tech: number, comm: number, teaching: number): string {
    const average = (tech + comm + teaching) / 3;
    if (average >= 85) return "GREEN";
    if (average >= 50) return "YELLOW";
    return "RED";
}
