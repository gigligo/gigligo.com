'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, CheckCircle } from 'lucide-react';

const features = [
    {
        title: 'Talented Professionals',
        description: 'Access a curated network of top-tier freelancers. We rigorously vet every professional on our platform to ensure exceptional quality and reliability for your projects.',
        icon: Users,
        color: 'from-blue-500/20 to-blue-500/0',
        iconColor: 'text-blue-500'
    },
    {
        title: 'Verified Quality',
        description: 'Every project goes through a strict quality assurance process. Our portfolio system and client reviews provide complete transparency before you hire.',
        icon: CheckCircle,
        color: 'from-emerald-500/20 to-emerald-500/0',
        iconColor: 'text-emerald-500'
    },
    {
        title: 'Secure Escrow Payments',
        description: 'Your funds are always safe. We hold payments in escrow and only release them when you are 100% satisfied with the delivered work. No surprises.',
        icon: ShieldCheck,
        color: 'from-purple-500/20 to-purple-500/0',
        iconColor: 'text-purple-500'
    },
    {
        title: 'Fast Matching System',
        description: 'Skip the endless scrolling. Our AI-driven matching algorithm connects you with the perfect freelancer for your specific needs in minutes, not days.',
        icon: Zap,
        color: 'from-amber-500/20 to-amber-500/0',
        iconColor: 'text-amber-500'
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
};

export function ModularFeatures() {
    return (
        <section className="py-24 sm:py-32 bg-[#FAFBFD] border-t border-border-light/50">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">

                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
                    >
                        Why Choose Us
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-text-main mb-6"
                    >
                        Everything you need to <br className="hidden sm:block" />
                        <span className="text-primary/90">scale with confidence.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl text-text-muted leading-relaxed"
                    >
                        We have built the ultimate infrastructure for freelance collaboration. Powerful, secure, and designed for speed.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative bg-white p-8 sm:p-10 rounded-3xl border border-border-light shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                {/* Subtle Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-light border border-border-light mb-8 group-hover:scale-110 transition-transform duration-500 ${feature.iconColor}`}>
                                        <Icon className="w-7 h-7" strokeWidth={2} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-text-muted text-lg leading-relaxed grow">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
