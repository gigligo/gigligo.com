import Link from 'next/link';

/* ─── Gradient G Logo ─── */
function GigligoMark({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <defs>
                <linearGradient id="footGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00f5d4" />
                    <stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#footGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="url(#footGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#00f5d4" />
        </svg>
    );
}

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
        <footer className="py-16 text-offwhite/50 border-t border-offwhite/8 bg-black">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
                    {/* About */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <GigligoMark size={28} />
                            <span className="font-display text-xl font-black tracking-tighter text-white">gigligo<span className="text-teal-vibrant opacity-60">.com</span></span>
                        </div>
                        <p className="mt-4 text-sm max-w-xs text-offwhite/40">
                            Pakistan's premium freelance marketplace connecting top talent with ambitious projects.
                            Zero international fees — local talent, global quality.
                        </p>
                        <div className="flex gap-4 mt-6">
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
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-offwhite/40 hover:bg-[#FE7743] hover:text-white transition-all duration-300"
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
                        <h4 className="font-bold text-white mb-4">For Clients</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/search" className="hover:text-teal-vibrant transition-colors">Find Talent</Link></li>
                            <li><Link href="/register" className="hover:text-teal-vibrant transition-colors">Post a Project</Link></li>
                            <li><Link href="/jobs" className="hover:text-teal-vibrant transition-colors">Browse Jobs</Link></li>
                            <li><Link href="/pricing" className="hover:text-teal-vibrant transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* For Freelancers */}
                    <div>
                        <h4 className="font-bold text-white mb-4">For Freelancers</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/register?role=SELLER" className="hover:text-teal-vibrant transition-colors">Become a Freelancer</Link></li>
                            <li><Link href="/search" className="hover:text-teal-vibrant transition-colors">Browse Gigs</Link></li>
                            <li><Link href="/jobs" className="hover:text-teal-vibrant transition-colors">Browse Jobs</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm mb-8">
                            <li><Link href="/about" className="hover:text-teal-vibrant transition-colors">About Us</Link></li>
                            <li><Link href="/faq" className="hover:text-teal-vibrant transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="hover:text-teal-vibrant transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-teal-vibrant transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-teal-vibrant transition-colors">Contact</Link></li>
                        </ul>

                        {/* Newsletter */}
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Stay Updated</h4>
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
                                className="bg-slate-900 border border-slate-800 text-sm text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:border-teal-vibrant transition-colors placeholder:text-slate-600"
                            />
                            <button type="submit" className="bg-slate-800 hover:bg-teal-vibrant text-white hover:text-slate-950 px-4 py-2 rounded-r-lg font-semibold transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-offwhite/30 truncate">
                        &copy; {new Date().getFullYear()} Gigligo. All rights reserved. Made for Pakistan with ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
}
