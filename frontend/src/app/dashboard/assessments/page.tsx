'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Code,
    Database,
    Palette,
    Cloud,
    BarChart,
    Smartphone,
    Timer,
    Trophy,
    RotateCcw,
    ChevronRight,
    Terminal,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Monitor,
    Cpu,
    Target
} from 'lucide-react';

const ASSESSMENTS = [
    { id: 'react', name: 'React & Next.js', icon: Code, questions: 15, duration: '15 min', difficulty: 'EXTREME', badge: 'React Architect', taken: false, score: null, color: '#007CFF' },
    { id: 'nodejs', name: 'Node.js Systems', icon: Cpu, questions: 12, duration: '12 min', difficulty: 'ADVANCED', badge: 'Backend Elite', taken: true, score: 92, color: '#10B981' },
    { id: 'uiux', name: 'Cinematic Design', icon: Palette, questions: 10, duration: '10 min', difficulty: 'ELITE', badge: 'Aesthetic Operative', taken: false, score: null, color: '#8B5CF6' },
    { id: 'devops', name: 'Cloud Protocols', icon: Cloud, questions: 12, duration: '12 min', difficulty: 'ADVANCED', badge: 'Infa Strategist', taken: false, score: null, color: '#F43F5E' },
    { id: 'python', name: 'Python Intelligence', icon: BarChart, questions: 15, duration: '15 min', difficulty: 'ADVANCED', badge: 'Data Specialist', taken: true, score: 78, color: '#F59E0B' },
    { id: 'mobile', name: 'Mobile Node', icon: Smartphone, questions: 10, duration: '10 min', difficulty: 'ELITE', badge: 'Mobile Vanguard', taken: false, score: null, color: '#EC4899' },
];

const SAMPLE_QUESTIONS = [
    {
        question: 'What does React.memo() execute within the reconciliation engine?',
        options: [
            'Memoizes render output to prevent unnecessary re-renders',
            'Stores state persistently in global infrastructure',
            'Caches API responses in the edge network',
            'Creates a stable reference to a DOM node',
        ],
        correct: 0,
    },
    {
        question: 'In Next.js App Router, what defines the visual envelope for nested segments?',
        options: [
            'SEO Metadata manifests',
            'Shared layout.tsx wrappers',
            'Root page.tsx overrides',
            'Global CSS variable definitions',
        ],
        correct: 1,
    },
    {
        question: 'What is the primary objective of the useMemo hook?',
        options: [
            'To store mutable references across cycles',
            'To stabilize callback function identities',
            'To memoize heavy computational results between cycles',
            'To trigger side effects post-commit phase',
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
        setTimeLeft(SAMPLE_QUESTIONS.length * 60);
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
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>

                <AnimatePresence mode="wait">
                    {!activeQuiz ? (
                        <motion.div
                            key="catalog"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full"
                        >
                            {/* Tactical Header */}
                            <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative z-10">
                                    <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12">
                                        <ArrowLeft size={16} className="group-hover:-translate-x-3 transition-transform" /> Dashboard
                                    </Link>

                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                        <div className="space-y-6">
                                            <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                                Validation <span className="text-primary not-italic">Hub.</span>
                                            </h1>
                                            <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                                Prove your technical dominance. Pass high-stakes skill validation to earn elite badges and priority network placement.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <StatBlock title="Badges" value={ASSESSMENTS.filter(a => a.taken && (a.score || 0) >= 70).length} />
                                            <StatBlock title="Pending" value={ASSESSMENTS.filter(a => !a.taken).length} />
                                            <StatBlock title="Avg. Rank" value={`${Math.round(ASSESSMENTS.filter(a => a.taken).reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(ASSESSMENTS.filter(a => a.taken).length, 1))}%`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                    {ASSESSMENTS.map((assessment, i) => (
                                        <AssessmentCard
                                            key={assessment.id}
                                            assessment={assessment}
                                            index={i}
                                            onStart={() => startQuiz(assessment)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : quizComplete ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto px-10 py-32 text-center space-y-16"
                        >
                            <div className="space-y-8 flex flex-col items-center">
                                <div className={`w-32 h-32 rounded-4xl flex items-center justify-center shadow-3xl ${score >= 70 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                                    {score >= 70 ? <Trophy size={60} strokeWidth={2.5} /> : <RotateCcw size={60} strokeWidth={2.5} />}
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
                                        {score >= 70 ? 'Clearance <span className="text-emerald-500">Granted.</span>' : 'Validation <span className="text-red-500">Failed.</span>'}
                                    </h2>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl mx-auto leading-relaxed">
                                        {score >= 70
                                            ? `Protocol successful. The "${activeQuiz.badge}" credentials have been synchronized with your personal dossier.`
                                            : `Capability threshold not met. Minimum 70% accuracy required for badge authorization. Retake protocol available.`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="text-[12rem] font-black italic tracking-tighter text-white/5 font-mono leading-none">
                                {score}%
                            </div>

                            <div className="flex justify-center gap-8">
                                <button onClick={() => setActiveQuiz(null)} className="px-12 py-6 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic h-20">
                                    CATALOG ARCHIVE
                                </button>
                                {score < 70 && (
                                    <button onClick={() => startQuiz(activeQuiz)} className="px-12 py-6 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-primary/30 italic h-20 active:scale-95">
                                        REINITIALIZE TEST
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-[1440px] mx-auto px-10 md:px-20 py-24"
                        >
                            <div className="max-w-4xl mx-auto space-y-16">
                                {/* Quiz HUD */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="space-y-3">
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6">
                                            <span className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                                                <Terminal size={24} className="text-primary" />
                                            </span>
                                            {activeQuiz.name}
                                        </h2>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic pl-20">ENCRYPTED VALIDATION TERMINAL</p>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">REMAINING WINDOW</p>
                                            <p className={`text-4xl font-black italic tracking-tighter font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{formatTime(timeLeft)}</p>
                                        </div>
                                        <div className="w-px h-16 bg-white/10" />
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">TRANSMISSION</p>
                                            <p className="text-4xl font-black italic tracking-tighter text-white font-mono">{currentQ + 1}<span className="text-white/20">/</span>{SAMPLE_QUESTIONS.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-tight mb-16">
                                        {SAMPLE_QUESTIONS[currentQ].question}
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6">
                                        {SAMPLE_QUESTIONS[currentQ].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelected(i)}
                                                className={`text-left p-8 rounded-3xl border transition-all duration-500 flex items-center gap-8 group ${selected === i
                                                    ? 'border-primary bg-primary/10 shadow-3xl shadow-primary/5'
                                                    : 'border-white/5 bg-white/1 hover:border-white/20 hover:bg-white/3'
                                                    }`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black italic transition-all duration-500 ${selected === i ? 'bg-primary text-white scale-110' : 'bg-black text-white/20 group-hover:text-white/40'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className={`text-xl font-bold italic tracking-tight transition-colors ${selected === i ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-10">
                                    <button onClick={() => setActiveQuiz(null)} className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-red-500 transition-colors italic">ABORT PROTOCOL</button>
                                    <button
                                        onClick={handleNext}
                                        disabled={selected === null}
                                        className="h-20 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl disabled:opacity-20 transition-all shadow-2xl shadow-primary/30 italic active:scale-95 flex items-center gap-6"
                                    >
                                        {currentQ + 1 >= SAMPLE_QUESTIONS.length ? 'FINALIZE TRANSMISSION' : 'NEXT PROTOCOL'}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

function AssessmentCard({ assessment, index, onStart }: any) {
    const Icon = assessment.icon;
    const isPassed = assessment.taken && (assessment.score || 0) >= 70;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/2 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden hover:border-primary/50 transition-all duration-700 hover:shadow-primary/5"
        >
            <div className={`absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-${assessment.color} to-transparent opacity-20`} />

            <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700">
                    <Icon size={28} strokeWidth={1.5} />
                </div>
                {assessment.taken && (
                    <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest italic border ${isPassed ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                        {isPassed ? 'AUTHORIZED' : 'RETRIAL REQ.'}
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-primary transition-colors mb-2">{assessment.name}</h3>

            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-8 italic">
                <span>{assessment.questions} PROTOCOLS</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span className={assessment.difficulty === 'EXTREME' ? 'text-red-500' : 'text-primary'}>{assessment.difficulty}</span>
            </div>

            {assessment.taken && (
                <div className="mb-10 space-y-3">
                    <div className="flex justify-between text-[10px] font-black italic tracking-tighter text-white/30 truncate">
                        <span>ACCURACY LEVEL</span>
                        <span className={isPassed ? 'text-emerald-500' : 'text-amber-500'}>{assessment.score}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${assessment.score}%` }}
                            className={`h-full ${isPassed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}
                        />
                    </div>
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">
                    <ShieldCheck size={14} />
                    {assessment.badge}
                </div>
                <button
                    onClick={onStart}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 text-white transition-all group-hover:bg-primary group-hover:border-primary group-hover:shadow-2xl active:scale-90"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}

function StatBlock({ title, value }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 flex flex-col items-center justify-center min-w-[120px] backdrop-blur-3xl">
            <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
            <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black mt-1 text-center">{title}</p>
        </div>
    );
}
