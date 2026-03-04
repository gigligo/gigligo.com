'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
    const navLinks = [
        { label: 'Explore', href: '/search' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
    ];

    const legalLinks = [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'FAQ', href: '/faq' },
    ];

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
                {/* Main Footer Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
                    {/* Logo + Description */}
                    <div className="max-w-xs">
                        <Link href="/" className="inline-block mb-3">
                            <Logo className="h-8 w-auto" variant="dark" />
                        </Link>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Connecting businesses with talented freelancers worldwide.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} Gigligo. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {legalLinks.map(link => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs text-text-muted hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
