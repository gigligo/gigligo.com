'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const portfolioItems = [
    {
        title: 'Fintech App Redesign',
        category: 'UI/UX Design',
        author: 'Sarah Chen',
        img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
        href: '/search?q=ui-design'
    },
    {
        title: 'E-Commerce Branding',
        category: 'Brand Identity',
        author: 'Marcus Kane',
        img: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        href: '/search?q=branding'
    },
    {
        title: 'SaaS Landing Page',
        category: 'Web Development',
        author: 'Tech Studio',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
        href: '/search?q=web-development'
    },
    {
        title: '3D Product Animation',
        category: 'Motion Graphics',
        author: 'Alex Morgan',
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80',
        href: '/search?q=3d-animation'
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } }
};

export function PortfolioShowcase() {
    return (
        <section className="py-24 sm:py-32 bg-white">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
                        >
                            Portfolio
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl font-bold tracking-tight text-text-main"
                        >
                            World-class work, <br className="hidden sm:block" />
                            <span className="text-text-muted">delivered daily.</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link href="/search" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark transition-colors group">
                            View all projects
                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 gap-6 sm:gap-8"
                >
                    {portfolioItems.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Link href={item.href} className="group block">
                                <div className="relative aspect-4/3 sm:aspect-video rounded-3xl overflow-hidden bg-surface-light border border-border-light mb-6">
                                    {/* Subtle Dark Overlay for contrast */}
                                    <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors duration-500" />

                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Hover Tag */}
                                    <div className="absolute top-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-text-main shadow-lg">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-text-muted font-medium">
                                            by {item.author}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 relative">
                                        <Image src={item.avatar} alt={item.author} fill sizes="48px" className="object-cover" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
