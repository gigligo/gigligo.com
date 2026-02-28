'use client';

import React from 'react';
import Link from 'next/link';

export default function ProjectsDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-start px-4 md:px-8 lg:px-12 pt-12 pb-24 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Title */}
            <div className="w-full max-w-5xl mb-16 animate-fade-in-up">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-text-main dark:text-white leading-[0.85]">
                        Active Projects<span className="text-primary">.</span>
                    </h1>
                    <p className="text-base font-serif italic text-text-muted font-light">
                        Orchestrate your high-stakes initiatives with precision and elegance.
                    </p>
                </div>
            </div>

            {/* Project List */}
            <div className="w-full max-w-5xl flex flex-col gap-8 md:gap-10">

                {/* Project Item 1 */}
                <article className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-gray-100 dark:border-white/5 rounded-xl bg-white dark:bg-[#1E1E1E] hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-2xl hover:shadow-gray-100 dark:hover:shadow-none transition-all duration-500">
                    <div className="flex items-start gap-6 md:gap-8 flex-1">
                        <div className="hidden md:block w-32 h-24 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                            <div className="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400")' }}>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="size-2 rounded-full bg-primary"></span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">In Progress</span>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors duration-300">
                                Series A Fundraising Deck
                            </h3>
                            <p className="text-sm md:text-base font-serif italic text-text-muted font-light">
                                Nearing Series A milestone, finalizing financial projections.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-12 shrink-0 md:pl-8">
                        <div className="flex flex-col items-end md:items-start gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted">Due Date</span>
                            <span className="font-sans font-medium text-text-main dark:text-slate-300 text-sm">Oct 24, 2026</span>
                        </div>
                        <button className="bg-primary hover:bg-primary-dark text-white px-8 md:px-12 py-4 md:py-5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-primary/20 flex items-center gap-3 rounded-full">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </article>

                {/* Project Item 2 */}
                <article className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-gray-100 dark:border-white/5 rounded-xl bg-white dark:bg-[#1E1E1E] hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-2xl hover:shadow-gray-100 dark:hover:shadow-none transition-all duration-500">
                    <div className="flex items-start gap-6 md:gap-8 flex-1">
                        <div className="hidden md:block w-32 h-24 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                            <div className="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400")' }}>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="size-2 rounded-full bg-primary"></span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">In Progress</span>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors duration-300">
                                Executive Branding Strategy
                            </h3>
                            <p className="text-sm md:text-base font-serif italic text-text-muted font-light">
                                Drafting core values, mission statement, and visual identity.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-12 shrink-0 md:pl-8">
                        <div className="flex flex-col items-end md:items-start gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted">Due Date</span>
                            <span className="font-sans font-medium text-text-main dark:text-slate-300 text-sm">Nov 02, 2026</span>
                        </div>
                        <button className="bg-primary hover:bg-primary-dark text-white px-8 md:px-12 py-4 md:py-5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-primary/20 flex items-center gap-3 rounded-full">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </article>

                {/* Project Item 3 */}
                <article className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-gray-100 dark:border-white/5 rounded-xl bg-white dark:bg-[#1E1E1E] hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-2xl hover:shadow-gray-100 dark:hover:shadow-none transition-all duration-500">
                    <div className="flex items-start gap-6 md:gap-8 flex-1">
                        <div className="hidden md:block w-32 h-24 overflow-hidden rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                            <div className="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out grayscale" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80&w=400")' }}>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="size-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Draft</span>
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors duration-300">
                                Q4 Global Expansion Plan
                            </h3>
                            <p className="text-sm md:text-base font-serif italic text-text-muted font-light">
                                Analyzing EMEA market entry points and regulatory hurdles.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-12 shrink-0 md:pl-8">
                        <div className="flex flex-col items-end md:items-start gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted">Last Edit</span>
                            <span className="font-sans font-medium text-text-main dark:text-slate-300 text-sm">2h ago</span>
                        </div>
                        <button className="bg-primary hover:bg-primary-dark text-white px-8 md:px-12 py-4 md:py-5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-primary/20 flex items-center gap-3 rounded-full">
                            <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                    </div>
                </article>

            </div>

            {/* CTA Action */}
            <div className="mt-16 w-full flex justify-center">
                <button className="border border-primary text-primary hover:bg-primary hover:text-white dark:hover:text-text-main px-10 md:px-14 py-4 md:py-5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 transform hover:-translate-y-1 rounded-full flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Create New Project
                </button>
            </div>
        </div>
    );
}
