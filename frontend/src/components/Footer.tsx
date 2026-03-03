import Link from 'next/link';
import { Logo } from '@/components/Logo';

function SocialIcon({ name }: { name: string }) {
    switch (name) {
        case 'twitter':
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
            );
        case 'instagram':
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            );
        case 'github':
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
            );
        default:
            return null;
    }
}

export function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-border-light dark:border-slate-800 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center mb-6">
                            <Logo className="h-60 w-auto dark:hidden" variant="dark" />
                            <Logo className="h-60 w-auto hidden dark:block" variant="white" />
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Connecting businesses with the world&apos;s most talented freelancers to get things done.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {(['twitter', 'linkedin', 'instagram', 'github'] as const).map(social => {
                                const urls: Record<string, string> = {
                                    twitter: 'https://twitter.com/gigligo',
                                    linkedin: 'https://linkedin.com/company/gigligo',
                                    instagram: 'https://instagram.com/gigligo',
                                    github: 'https://github.com/gigligo',
                                };
                                return (
                                    <a
                                        key={social}
                                        href={urls[social]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border border-border-light dark:border-slate-700 flex items-center justify-center text-text-muted/80 hover:border-primary hover:text-primary transition-all duration-300"
                                        aria-label={social}
                                    >
                                        <SocialIcon name={social} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-slate-100">Categories</h4>
                        <ul className="flex flex-col gap-2 text-sm text-text-muted dark:text-text-muted/80">
                            <li><Link href="/search?category=Design" className="hover:text-primary transition-colors">Graphics &amp; Design</Link></li>
                            <li><Link href="/search?category=Marketing" className="hover:text-primary transition-colors">Digital Marketing</Link></li>
                            <li><Link href="/search?category=Writing" className="hover:text-primary transition-colors">Writing &amp; Translation</Link></li>
                            <li><Link href="/search?category=video" className="hover:text-primary transition-colors">Video &amp; Animation</Link></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-slate-100">About</h4>
                        <ul className="flex flex-col gap-2 text-sm text-text-muted dark:text-text-muted/80">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Press &amp; News</Link></li>
                            <li><Link href="/referral" className="hover:text-primary transition-colors">Partnerships</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-slate-100">Support</h4>
                        <ul className="flex flex-col gap-2 text-sm text-text-muted dark:text-text-muted/80">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">Trust &amp; Safety</Link></li>
                            <li><Link href="/register?role=SELLER" className="hover:text-primary transition-colors">Selling on GIGLIGO</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Buying on GIGLIGO</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border-light/50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted/80 text-xs">
                    <p>&copy; GIGLIGO International Ltd. {new Date().getFullYear()}</p>
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">share</span>
                        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">language</span>
                        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">currency_exchange</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
