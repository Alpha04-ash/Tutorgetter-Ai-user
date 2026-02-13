'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, PartyPopper } from 'lucide-react';

import CameraRecorder, { CameraRecorderHandle } from './CameraRecorder';
import CosmicBackground from './CosmicBackground';
import GlassCard from './GlassCard';
import HoloButton from './HoloButton';
import Modal from './Modal';
import styles from '../app/user/user.module.css';

interface Question {
    id: number;
    text: string;
    type?: 'CODE' | 'THEORY' | 'TEACHING';
}

interface AssessmentFlowProps {
    categoryId: number;
    questions: Question[];
}

interface Answer {
    questionId: number;
    text: string;
}

export default function AssessmentFlow({ categoryId, questions }: AssessmentFlowProps) {
    const router = useRouter();
    const [step, setStep] = useState<'intro' | 'exam' | 'submitting'>('intro');
    const [user, setUser] = useState<any>(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentAnswerText, setCurrentAnswerText] = useState("");

    const cameraRef = useRef<CameraRecorderHandle>(null);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

    // Modal State
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

    // Fix: Restoration of answersRef
    const answersRef = useRef<Answer[]>([]);

    const sortedQuestions = useMemo(() => {
        const sortOrder: Record<string, number> = { 'CODE': 1, 'THEORY': 2, 'TEACHING': 3 };
        return [...questions].sort((a, b) => {
            const typeA = a.type || 'THEORY';
            const typeB = b.type || 'THEORY';
            return (sortOrder[typeA] || 99) - (sortOrder[typeB] || 99);
        });
    }, [questions]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        if (userId) {
            setUser({ id: userId, email: userEmail });
        } else {
            console.warn("User ID missing, might fail submit");
        }
    }, []);

    // Warn if refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step === 'exam') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step]);


    const handleStart = () => {
        setInstructionsModalOpen(true);
    };

    const confirmStart = () => {
        setInstructionsModalOpen(false);
        setStep('exam');
        setTimeout(() => {
            cameraRef.current?.startRecording();
        }, 1000);
    };

    const activeQuestion = sortedQuestions[currentIndex];

    // Helper to get part description based on question type
    const getPartDescription = (type?: string) => {
        switch (type) {
            case 'CODE': return "Coding Challenge";
            case 'THEORY': return "Theoretical Knowledge";
            case 'TEACHING': return "Teaching Simulation";
            default: return "Question";
        }
    }

    const handleNext = () => {
        // Save current answer
        if (activeQuestion) {
            const newAns = { questionId: activeQuestion.id, text: currentAnswerText };
            const updated = [...answers, newAns];
            setAnswers(updated);
            answersRef.current = updated; // Sync ref
        }

        if (currentIndex < sortedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentAnswerText(""); // Clear for next
        } else {
            finishAssessment();
        }
    };

    const finishAssessment = async () => {
        setStep('submitting');
        // Stop camera
        const blob = await cameraRef.current?.stopRecording();
        setVideoBlob(blob || null);

        // Submit
        try {
            const formData = new FormData();
            formData.append('userId', user?.id || '1');
            formData.append('categoryId', String(categoryId));
            formData.append('answersJson', JSON.stringify(answersRef.current)); // Use ref for latest
            if (blob) {
                formData.append('video_file', blob, 'assessment_video.webm');
            }

            const res = await fetch('/api/assessments/submit', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setSuccessModalOpen(true);
            } else {
                const err = await res.text();
                alert(`Submission failed: ${err}`);
                setStep('intro'); // Reset or handle error
            }
        } catch (e) {
            console.error(e);
            alert("Network error");
            setStep('intro');
        }
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
        router.push('/');
    };

    if (step === 'intro') {
        return (
            <main className={styles.mainContainer}>
                <CosmicBackground />
                <GlassCard className="max-w-2xl w-full text-center p-12">
                    <h1 className="cosmic-text-gradient text-5xl font-extrabold mb-6">ready?</h1>

                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        You have selected the <span className="text-sky-400 font-semibold">Python Developer</span> assessment.
                        <br />
                        This will test your coding skills, theoretical knowledge, and communication ability.
                    </p>

                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 text-left mb-8">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="mt-1 min-w-[20px]">ℹ️</div>
                            <p className="text-sm text-slate-400">
                                Ensure your camera and microphone are working.
                                You will be recorded during the session to verify authenticity and analyze communication skills.
                            </p>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isTermsAccepted ? 'bg-sky-500 border-sky-500' : 'border-slate-500 group-hover:border-sky-400'}`}>
                                {isTermsAccepted && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isTermsAccepted}
                                onChange={e => setIsTermsAccepted(e.target.checked)}
                            />
                            <span className="text-slate-300 group-hover:text-white transition-colors">
                                I accept the <Link href="/terms" className="text-sky-400 hover:underline">Terms & Policy</Link>
                            </span>
                        </label>
                    </div>

                    <HoloButton
                        onClick={handleStart}
                        disabled={!isTermsAccepted}
                        className="w-full justify-center text-lg py-4"
                    >
                        Start Assessment
                    </HoloButton>
                </GlassCard>

                {/* Instructions Modal */}
                <Modal
                    isOpen={instructionsModalOpen}
                    onClose={() => setInstructionsModalOpen(false)}
                    title="Instructions"
                    footer={
                        <HoloButton className="w-full justify-center" onClick={confirmStart}>
                            I Understand, Begin!
                        </HoloButton>
                    }
                >
                    <div className="space-y-4 text-slate-300">
                        <p>1. <b>Camera:</b> Ensure your face is clearly visible within the frame at all times.</p>
                        <p>2. <b>Audio:</b> Speak clearly when answering teaching questions.</p>
                        <p>3. <b>Time:</b> Take your time, but try to be concise.</p>
                        <p>4. <b>Integrity:</b> Do not use external help or switch tabs frequently.</p>
                        <p className="text-sky-400 text-sm mt-4">Good luck!</p>
                    </div>
                </Modal>
            </main>
        );
    }

    if (step === 'submitting') {
        return (
            <main className={styles.mainContainer}>
                <CosmicBackground />
                <GlassCard className="text-center p-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Submitting Assessment...</h2>
                    <p className="text-slate-400">Please wait while we upload your answers and video.</p>
                </GlassCard>

                <Modal
                    isOpen={successModalOpen}
                    onClose={closeSuccessModal}
                    title="Assessment Complete!"
                    footer={<HoloButton className="w-full justify-center" onClick={closeSuccessModal}>Return to Home</HoloButton>}
                >
                    <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                            <PartyPopper size={32} />
                        </div>
                        <p className="text-lg text-slate-200 mb-2">Excellent job!</p>
                        <p className="text-slate-400">
                            Your assessment has been submitted successfully.
                            Our AI is now analyzing your results. You will receive feedback shortly.
                        </p>
                    </div>
                </Modal>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
            <CosmicBackground />

            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-slate-300">REC</span>
                </div>
                <div className="text-sm text-slate-400">
                    Question <span className="text-white font-bold">{currentIndex + 1}</span> of {sortedQuestions.length}
                </div>
            </header>

            <div className="flex-1 flex relative z-10">
                {/* Left: Question & Input */}
                <div className="flex-1 p-8 flex flex-col max-w-4xl mx-auto w-full">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold tracking-wider mb-4 border border-sky-500/20">
                            PART {currentIndex + 1}: {getPartDescription(activeQuestion?.type).toUpperCase()}
                        </span>
                        <h2 className="text-2xl font-bold leading-relaxed text-slate-100">
                            {activeQuestion?.text || "Loading question..."}
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <textarea
                            className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl p-6 text-slate-200 focus:outline-none focus:border-sky-500/50 transition-colors resize-none font-mono text-base shadow-inner"
                            placeholder="Type your answer here..."
                            spellCheck={false}
                            value={currentAnswerText}
                            onChange={(e) => setCurrentAnswerText(e.target.value)}
                        />
                        <div className="mt-6 flex justify-end">
                            <HoloButton onClick={handleNext} className="px-8">
                                {currentIndex === sortedQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                            </HoloButton>
                        </div>
                    </div>
                </div>

                {/* Right: Camera Preview (Floating/Fixed) */}
                <div className="w-80 p-6 flex flex-col gap-4 hidden lg:flex">
                    <div className="sticky top-6">
                        <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group">
                            <CameraRecorder ref={cameraRef} />
                            <div className="absolute inset-0 border-2 border-white/5 pointer-events-none rounded-xl"></div>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-2">
                            Face visible • Audio recording active
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
