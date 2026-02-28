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
        <footer className="py-20 text-white/50 bg-[#1E1E1E] border-t border-[#3A3A3A]">
            <div className="max-container pt-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                    {/* About */}
                    <div className="md:col-span-1 border-gray-800 pr-8">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Logo className="h-8" iconClassName="text-[#C9A227]" withText={false} />
                            <span className="font-sans text-xl font-bold tracking-tight text-[#FFFFFF]">gigligo<span className="text-[#C9A227] opacity-80">.com</span></span>
                        </Link>
                        <p className="mt-4 text-[15px] leading-relaxed max-w-xs text-[#F7F7F6]/60">
                            The professional arena where verified talent meets serious business.
                        </p>
                        <div className="flex gap-4 mt-8">
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
                                        className="w-10 h-10 rounded-full border border-[#3A3A3A] bg-transparent flex items-center justify-center text-[#F7F7F6]/60 hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[#C9A227]/5 transition-all duration-300"
                                        aria-label="Social Link"
                                    >
                                        <SocialIcon name={social} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* For Clients */}
                    <div>
                        <h4 className="font-bold text-[#FFFFFF] text-sm tracking-wider uppercase mb-6">For Clients</h4>
                        <ul className="space-y-4 text-[15px]">
                            <li><Link href="/search" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Find Talent</Link></li>
                            <li><Link href="/register" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Post a Project</Link></li>
                            <li><Link href="/jobs" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Browse Jobs</Link></li>
                            <li><Link href="/pricing" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* For Freelancers */}
                    <div>
                        <h4 className="font-bold text-[#FFFFFF] text-sm tracking-wider uppercase mb-6">For Freelancers</h4>
                        <ul className="space-y-4 text-[15px]">
                            <li><Link href="/register?role=SELLER" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Become a Freelancer</Link></li>
                            <li><Link href="/search" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Browse Gigs</Link></li>
                            <li><Link href="/jobs" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Browse Jobs</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-[#FFFFFF] text-sm tracking-wider uppercase mb-6">Legal</h4>
                        <ul className="space-y-4 text-[15px] mb-12">
                            <li><Link href="/about" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">About Us</Link></li>
                            <li><Link href="/faq" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="text-[#F7F7F6]/60 hover:text-[#C9A227] transition-colors">Contact</Link></li>
                        </ul>

                        {/* Newsletter */}
                        <h4 className="text-xs font-bold text-[#F7F7F6]/40 uppercase tracking-widest mb-4">Stay Updated</h4>
                        <form className="flex group" onSubmit={(e) => {
                            e.preventDefault();
                            const email = (e.target as any).email.value;
                            fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/newsletter/subscribe`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email })
                            }).then(res => res.json()).then(data => alert(data.message));
                        }}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                required
                                className="bg-[#1E1E1E] border border-[#3A3A3A] text-sm text-[#FFFFFF] px-4 py-3 rounded-l-lg w-full focus:outline-none focus:border-[#C9A227] transition-colors placeholder:text-[#3A3A3A]"
                            />
                            <button type="submit" className="bg-[#C9A227] hover:bg-[#b89222] text-[#1E1E1E] px-6 py-3 rounded-r-lg font-semibold transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#3A3A3A]/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[#F7F7F6]/40">
                        &copy; {new Date().getFullYear()} Gigligo. The professional arena.
                    </p>
                </div>
            </div>
        </footer>
    );
}
