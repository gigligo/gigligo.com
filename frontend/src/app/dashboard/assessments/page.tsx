'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

// Mock assessment catalog
const ASSESSMENTS = [
    { id: 'react', name: 'React & Next.js', icon: 'code', questions: 15, duration: '15 min', difficulty: 'Advanced', badge: 'React Expert', taken: false, score: null },
    { id: 'nodejs', name: 'Node.js Architecture', icon: 'dns', questions: 12, duration: '12 min', difficulty: 'Advanced', badge: 'Backend Pro', taken: true, score: 92 },
    { id: 'uiux', name: 'UI/UX Design Principles', icon: 'palette', questions: 10, duration: '10 min', difficulty: 'Intermediate', badge: 'Design Verified', taken: false, score: null },
    { id: 'devops', name: 'DevOps & Cloud Infrastructure', icon: 'cloud', questions: 12, duration: '12 min', difficulty: 'Advanced', badge: 'Cloud Architect', taken: false, score: null },
    { id: 'python', name: 'Python & Data Science', icon: 'analytics', questions: 15, duration: '15 min', difficulty: 'Advanced', badge: 'Data Expert', taken: true, score: 78 },
    { id: 'mobile', name: 'Mobile Development (React Native)', icon: 'smartphone', questions: 10, duration: '10 min', difficulty: 'Intermediate', badge: 'Mobile Dev', taken: false, score: null },
];

const SAMPLE_QUESTIONS = [
    {
        question: 'What does React.memo() do?',
        options: [
            'Memoizes render output to prevent unnecessary re-renders',
            'Stores state persistently in localStorage',
            'Caches API responses in memory',
            'Creates a ref to a DOM element',
        ],
        correct: 0,
    },
    {
        question: 'In Next.js App Router, what is the purpose of a layout.tsx file?',
        options: [
            'It defines metadata for SEO optimization',
            'It defines shared UI that wraps pages in the same directory',
            'It replaces the need for a root page.tsx file',
            'It sets global CSS variables automatically',
        ],
        correct: 1,
    },
    {
        question: 'What is the purpose of useMemo in React?',
        options: [
            'To store mutable values between renders',
            'To create a stable reference to a callback function',
            'To memoize expensive computations between renders',
            'To create a side effect after rendering',
        ],
        correct: 2,
    },
];

export default function AssessmentsPage() {
    const [activeQuiz, setActiveQuiz] = useState<typeof ASSESSMENTS[0] | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const startQuiz = (assessment: typeof ASSESSMENTS[0]) => {
        setActiveQuiz(assessment);
        setCurrentQ(0);
        setSelected(null);
        setAnswers([]);
        setQuizComplete(false);
        setTimeLeft(SAMPLE_QUESTIONS.length * 60); // 1 min per question
    };

    const handleNext = () => {
        if (selected === null) return;
        const newAnswers = [...answers, selected];
        setAnswers(newAnswers);
        setSelected(null);

        if (currentQ + 1 >= SAMPLE_QUESTIONS.length) {
            setQuizComplete(true);
        } else {
            setCurrentQ(currentQ + 1);
        }
    };

    const score = quizComplete
        ? Math.round((answers.filter((a, i) => a === SAMPLE_QUESTIONS[i].correct).length / SAMPLE_QUESTIONS.length) * 100)
        : 0;

    // Timer
    useEffect(() => {
        if (!activeQuiz || quizComplete || timeLeft <= 0) return;
        const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [activeQuiz, quizComplete, timeLeft]);

    const formatTime = useCallback((s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Header */}
                <div className="border-b border-border-light bg-surface-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none" />
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            </Link>
                            <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Skill Assessments</h1>
                        </div>
                        <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl pl-10">
                            Prove your expertise. Pass assessments to earn verified badges that boost your search ranking and client trust.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                    {!activeQuiz ? (
                        /* Assessment Catalog */
                        <div className="space-y-8 animate-fade-in">
                            {/* Stats Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Badges Earned</p>
                                    <p className="text-3xl font-black text-primary">{ASSESSMENTS.filter(a => a.taken && (a.score || 0) >= 70).length}</p>
                                </div>
                                <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Available Tests</p>
                                    <p className="text-3xl font-black text-text-main">{ASSESSMENTS.filter(a => !a.taken).length}</p>
                                </div>
                                <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Average Score</p>
                                    <p className="text-3xl font-black text-text-main">
                                        {Math.round(ASSESSMENTS.filter(a => a.taken).reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(ASSESSMENTS.filter(a => a.taken).length, 1))}%
                                    </p>
                                </div>
                            </div>

                            {/* Assessment Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ASSESSMENTS.map(assessment => (
                                    <div key={assessment.id} className="bg-surface-light border border-border-light rounded-2xl p-6 flex flex-col hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-2xl">{assessment.icon}</span>
                                            </div>
                                            {assessment.taken && (
                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${(assessment.score || 0) >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {(assessment.score || 0) >= 70 ? 'Passed' : 'Retake Available'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main mb-1">{assessment.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-text-muted mb-4 font-medium">
                                            <span>{assessment.questions} Questions</span>
                                            <span>•</span>
                                            <span>{assessment.duration}</span>
                                            <span>•</span>
                                            <span className={assessment.difficulty === 'Advanced' ? 'text-red-500' : 'text-primary'}>{assessment.difficulty}</span>
                                        </div>

                                        {assessment.taken && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                                    <span className="text-text-muted">Score</span>
                                                    <span className={`${(assessment.score || 0) >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>{assessment.score}%</span>
                                                </div>
                                                <div className="w-full bg-border-light rounded-full h-2 overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${(assessment.score || 0) >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                        style={{ width: `${assessment.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                                {assessment.badge}
                                            </div>
                                            <button
                                                onClick={() => startQuiz(assessment)}
                                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                                            >
                                                {assessment.taken ? 'Retake' : 'Start Quiz'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : quizComplete ? (
                        /* Results Screen */
                        <div className="max-w-2xl mx-auto animate-fade-in">
                            <div className="bg-surface-light border border-border-light rounded-3xl p-8 sm:p-12 text-center">
                                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${score >= 70 ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    <span className="material-symbols-outlined text-5xl">{score >= 70 ? 'emoji_events' : 'refresh'}</span>
                                </div>
                                <h2 className="text-3xl font-black text-text-main mb-2">
                                    {score >= 70 ? 'Assessment Passed!' : 'Almost There!'}
                                </h2>
                                <p className="text-text-muted text-lg mb-8">
                                    {score >= 70
                                        ? `Congratulations! You earned the "${activeQuiz.badge}" badge.`
                                        : `You scored ${score}%. A score of 70% or higher is required to earn the badge.`
                                    }
                                </p>
                                <div className="text-6xl font-black text-primary font-mono mb-8">{score}%</div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setActiveQuiz(null)}
                                        className="px-8 py-3 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-xl hover:border-primary/50 transition-colors"
                                    >
                                        Back to Catalog
                                    </button>
                                    {score < 70 && (
                                        <button
                                            onClick={() => startQuiz(activeQuiz)}
                                            className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                        >
                                            Retry Assessment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Active Quiz */
                        <div className="max-w-3xl mx-auto animate-fade-in">
                            {/* Quiz Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-text-main">{activeQuiz.name}</h2>
                                    <p className="text-sm text-text-muted">Question {currentQ + 1} of {SAMPLE_QUESTIONS.length}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-4 py-2 rounded-lg font-mono text-sm font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-surface-light border border-border-light text-text-main'}`}>
                                        <span className="material-symbols-outlined text-[14px] mr-1 align-middle">timer</span>
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="w-full bg-border-light rounded-full h-1.5 mb-8 overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${((currentQ + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                                />
                            </div>

                            {/* Question Card */}
                            <div className="bg-surface-light border border-border-light rounded-2xl p-8 sm:p-10 mb-8">
                                <h3 className="text-xl font-bold text-text-main mb-8 leading-relaxed">
                                    {SAMPLE_QUESTIONS[currentQ].question}
                                </h3>
                                <div className="space-y-3">
                                    {SAMPLE_QUESTIONS[currentQ].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelected(i)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selected === i
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-border-light hover:border-primary/30 hover:bg-background-light'
                                                }`}
                                        >
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${selected === i ? 'bg-primary text-white' : 'bg-background-light text-text-muted border border-border-light'
                                                }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="text-sm font-medium text-text-main">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setActiveQuiz(null)}
                                    className="text-sm font-bold text-text-muted hover:text-red-500 transition-colors"
                                >
                                    Abandon Quiz
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={selected === null}
                                    className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {currentQ + 1 >= SAMPLE_QUESTIONS.length ? 'Submit Assessment' : 'Next Question'}
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
