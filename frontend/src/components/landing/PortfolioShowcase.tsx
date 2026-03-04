'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const portfolioItems = [
    {
        title: 'Fintech App Redesign',
        category: 'UI/UX Design',
        budget: '$2,500',
        img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80',
        href: '/search?q=ui-design'
    },
    {
        title: 'E-Commerce Branding',
        category: 'Brand Identity',
        budget: '$1,800',
        img: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&q=80',
        href: '/search?q=branding'
    },
    {
        title: 'SaaS Landing Page',
        category: 'Web Development',
        budget: '$3,200',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        href: '/search?q=web-development'
    },
    {
        title: '3D Product Animation',
        category: 'Motion Graphics',
        budget: '$4,000',
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
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
        <section className="py-16 sm:py-20 bg-white">
            <div className="container px-6 md:px-10 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5"
                        >
                            Projects
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-4xl font-bold tracking-tight text-text-main"
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
                        <Link href="/search" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark transition-colors group text-sm">
                            View all projects
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {portfolioItems.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Link href={item.href} className="group block">
                                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <h3 className="text-base font-semibold text-text-main mb-1 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-text-muted">{item.category}</span>
                                    <span className="text-xs font-bold text-primary">{item.budget}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
