'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/TacticalUI';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

export default function ProjectsDashboardPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-primary/30 antialiased overflow-x-hidden">
                {/* Background Atmosphere */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-32 relative z-10">
                    {/* Tactical Header */}
                    <header className="mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12 italic">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-3 transition-transform" /> Return to Command
                            </Link>

                            <div className="flex flex-col gap-6">
                                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                    Active <span className="text-primary not-italic">Logistics.</span>
                                </h1>
                                <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                    Orchestrate high-stakes operations with surgical precision. All active contracts and deliverables synchronized in real-time.
                                </p>
                            </div>
                        </motion.div>
                    </header>

                    {/* Logistics Grid */}
                    <div className="grid grid-cols-1 gap-12">
                        <ProjectItem
                            id="1"
                            title="Series A Fundraising Deck"
                            status="In Progress"
                            description="Finalizing financial projections and neural pitch-deck optimization."
                            dueDate="Oct 24, 2026"
                            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                            priority="High"
                        />

                        <ProjectItem
                            id="2"
                            title="Executive Branding Strategy"
                            status="Active"
                            description="Calibrating visual identity protocols and core value alignment."
                            dueDate="Nov 02, 2026"
                            image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
                            priority="Medium"
                        />

                        <ProjectItem
                            id="3"
                            title="Q4 Global Expansion Plan"
                            status="Protocol Sync"
                            description="Analyzing EMEA market entry points and regulatory barrier modulation."
                            dueDate="Dec 15, 2026"
                            image="https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80&w=800"
                            priority="Low"
                        />
                    </div>

                    {/* Deployment Action */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 flex flex-col items-center gap-10"
                    >
                        <div className="h-20 w-px bg-white/10" />
                        <Link href="/jobs/post">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-white px-20 py-6 text-xs font-black tracking-[0.4em] uppercase shadow-2xl shadow-primary/30 flex items-center gap-6 rounded-full italic"
                            >
                                <Plus className="w-5 h-5" />
                                Initialize New Operation
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}

function ProjectItem({ id, title, status, description, dueDate, image, priority }: any) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 p-12 lg:p-16 border border-white/5 rounded-[4rem] bg-white/2 hover:bg-white/5 hover:border-primary/30 transition-all duration-700 backdrop-blur-3xl overflow-hidden shadow-2xl"
        >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 flex-1 relative z-10">
                <div className="w-full lg:w-48 h-32 overflow-hidden rounded-3xl bg-black border border-white/10 shrink-0">
                    <div className="w-full h-full bg-cover bg-center opacity-40 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000 ease-[0.16, 1, 0.3, 1]" style={{ backgroundImage: `url("${image}")` }}>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-5">
                        <span className="px-5 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-lg shadow-primary/20">
                            {status}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                            Priority: <span className={priority === 'High' ? 'text-red-500' : priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}>{priority}</span>
                        </span>
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-none group-hover:text-primary transition-all duration-500">
                        {title}
                    </h3>
                    <p className="text-lg font-bold italic text-white/40 max-w-xl leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-12 shrink-0 relative z-10">
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 leading-none">Objective Date</span>
                    <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{dueDate}</span>
                </div>

                <Link href={`/dashboard/projects/${id}`}>
                    <motion.button
                        whileHover={{ scale: 1.1, x: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white w-20 h-20 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-xl group/btn"
                    >
                        <ArrowRight className="w-6 h-6 font-light group-hover/btn:scale-125 transition-transform duration-500" />
                    </motion.button>
                </Link>
            </div>
        </motion.article>
    );
}
