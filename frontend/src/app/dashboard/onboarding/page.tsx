'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const STEPS = [
    { id: 1, title: 'Complete Your Profile', icon: 'person', description: 'Add your photo, bio, skills, and hourly rate' },
    { id: 2, title: 'Verify Your Identity', icon: 'verified_user', description: 'Complete KYC verification to earn trust badges' },
    { id: 3, title: 'Create Your First Gig', icon: 'storefront', description: 'Showcase your services with a compelling gig listing' },
    { id: 4, title: 'Set Up Payments', icon: 'account_balance', description: 'Link your bank or wallet for seamless payouts' },
];

export default function OnboardingPage() {
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const markComplete = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
        }
        if (step < STEPS.length - 1) setCurrentStep(step + 1);
    };

    const progress = (completedSteps.length / STEPS.length) * 100;

    const stepLinks: Record<number, string> = {
        0: '/dashboard/profile',
        1: '/dashboard/kyc',
        2: '/dashboard',
        3: '/dashboard/earnings',
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />
            <main className="flex-1 w-full flex items-center justify-center px-6 py-20" style={{ paddingTop: 120 }}>
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">celebration</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">
                            Welcome{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="text-text-muted text-sm">Complete these steps to get the most out of Gigligo.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-10">
                        <div className="flex justify-between text-xs font-bold text-text-muted mb-2">
                            <span>{completedSteps.length} of {STEPS.length} complete</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-border-light rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                        {STEPS.map((step, i) => {
                            const isComplete = completedSteps.includes(i);
                            const isCurrent = currentStep === i;
                            return (
                                <div
                                    key={step.id}
                                    className={`bg-surface-light border rounded-2xl p-6 transition-all ${isCurrent ? 'border-primary/30 shadow-md shadow-primary/5' : isComplete ? 'border-green-200' : 'border-border-light'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? 'bg-green-50 text-green-600' : isCurrent ? 'bg-primary/10 text-primary' : 'bg-background-light text-text-muted'
                                            }`}>
                                            <span className="material-symbols-outlined">
                                                {isComplete ? 'check_circle' : step.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold ${isComplete ? 'text-green-700 line-through' : 'text-text-main'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                                        </div>
                                        {isComplete ? (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Done</span>
                                        ) : (
                                            <Link
                                                href={stepLinks[i]}
                                                onClick={() => markComplete(i)}
                                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                                            >
                                                Start
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Skip */}
                    <div className="text-center mt-8">
                        <Link href="/dashboard" className="text-sm text-text-muted hover:text-primary font-bold transition-colors">
                            Skip for now →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
