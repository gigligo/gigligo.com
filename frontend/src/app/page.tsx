'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';

/* ──────────────────── Scroll Reveal ──────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.unobserve(el); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const r = useReveal();
  return <div ref={r} className={`reveal-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ──────────────────── Data ──────────────────── */
const categoryCards = [
  { label: 'Build your brand', title: 'Logo Design', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaysnfWaJlh7QDzETj1VvvnZ5W1MOKBOQi1WXVOLsRO_QSsNK0rJlWXVqQbk5r_TQB6MvtXlUdwsC1q4hNfCbi7U4titwRjFF4U4AKgchGZ3eJtRaw0cECvNvrXVhueS-l9gmivrM-GdmSCO-o2gB4wj5LTnBbesG0vs9PHe34zQiI4u3WUwtSj_FKfI5IxNEP-akLMe545pVJUQW5EURv3b6QhBBHJ9eqDSLZfjjI4PMbR8Mb8szMMw_Q6zcoIusMb57ZLM07u1Y', href: '/search?category=Design' },
  { label: 'Customize your site', title: 'WordPress', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlaYkoUXLs1sooZC6hDEkd9NLqGbq2ExLmzl6zza5UdvDuPBksvhgVUeOYcenIkoVZVRl9-ZJB_qGvq9NW99uyj6J8yVq9P3U_mhce3KSwTDXDUJgXeXwKG6583WSRRS-DoVbgt6JNJMD0XF6KDjhnazWL6KNUo0E54ZRLycd5UaSzC_1rFIcMYg4eeJmqP4osyI4aEkhq8bz5YgF2vxPtUgb6-2XAhTaF_JOgZ9EoVNVrpTtTVplJrWH0KK09ku8q-v2E5-5dNes', href: '/search?category=Development' },
  { label: 'Share your message', title: 'Video Explainer', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzz1mKBHWZmWrokWlzVKV3LNxIxrAxVDpvNB6eTRlUw_JaSL2EC1FqQzdekoxpOQ2bUozGRymh7WJkWvaR66uLdl3yyKKTXtnaZvfBVDXSZgc5ZaA69CIOw_OG7nYZi6DATkMMLv4GWv8yf8WW7kZt2TU1UQD6ZqVjszG3e91BoRhLNhqnbs1Y979Go2VCtvVtigD7zvrDmW-smoWxVfYFwEDRcKv-b02xD7TFsq02ZOee6en4YZMg9Eki8MLxpINh-pGei0aY77g', href: '/search?category=video' },
  { label: 'Reach more customers', title: 'Social Media', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD_6cs9-7EtuFG-wgwjTsjxXrmmex_rj6AAucuzpL0pJa0MbYMBn4HH0BtroJpJmkLhinJ_DdxCV6KnQBwcJX3rXwZ36yx_tJ1eI64RCWclygWB9lvLvyJlhKqQSaQIZBiqVk0aSSZ1ERaZWBVf7oDgtizrErS2XL9TJszNaejeTH37M-hwYqKRnjWe2VEpvX3kbVdzpFFFyMY4e72SSMTKWgicbSXbXawoBUAQnCqAPLTvhr6llsPmYuBXSkEUGeGLM7qFwHGWT0', href: '/search?category=Marketing' },
  { label: 'Scale your product', title: 'Web Development', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX6qt-kaCipzS4Gzk4yL8OUJNjSKF30PemC3kprphHZDOmEzgXnyyjQ0S5T4djBoIa_5sTTm-hHsFNCP4mwwjrZxOl6Tu1ju6nckpVjxxq3r3_skADabZYNT3ln3T7nWTpBEPWW5ZQWhsPfvTgoSQOORyeQOqZUFS2w5ogbFucT0dFaYIvDw5FduQH8u_INvjVTkywT4o24-2m9myTe2sNzRL7bNaSlAE3iCquY-cHguL_4kDy1eGwnrJZ0Mlp9NQNCnGX0pfd-1c', href: '/search?category=Development' },
];

const inspirationItems = [
  { title: 'Packaging Design', author: 'Alex Morgan', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2eve36IgL1d9CDO_2mO5_3MA4X8WQ1oJchPUxou9NmKiikhdU9B0BC6wFpUVVcRWpOY5JqeCQtYRoAeQXB8AG0B4K_Axj2SpUmS2F4PHzeMwTjpJkeGY3LOrxJKyI1XZ2YeAPiIF0weh5oePUD8chxh9oZqutFApnCQUm3aUxgl2mLqVYVR5_ClNrcIakGj98AVOvG--dO2ktj10J8sAmdtb9VlnwhJ5RIcE5Ups-dL-euBsIUEaLMJgziL7JmLy7yACDGbo6vko', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDifsW_ISHpDhS-k_4LVPU-3iTZ9SRTjBVHk51_soNwO7afiLW6D0iGLScYH6vwnSxlt2DJf83DYWxHg9fF5vuEoKESyMSJtac7YFNQRTWUW9z9vbwb8FlLecL3VqJvVRH3MPsG7pd_N4f0iH00y3BM5a1M_OKB4uW_HgRikF1uxwmqAaNx8tnvMcuCq8lS0Z-x8ehrwqm-RENytC0XHsSpXtcwq2cpc003BKepnCfGPljJ9yvYkvLf1lZ-amlYm5MvXXOY7-xBq9w' },
  { title: 'Animated Ads', author: 'Sarah Chen', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWK0SCs2XpmaP-o4aILC0CRgGrJ32Nn4RqsZjFAIGGALnqIAGYeiciJJWveJiKqIXPpnflaxgRraBroc-hS64nGQCuApZ3PFWS4H_4rmR76gOZRYwxvZ_EPg2OWpSCdne0Znkk8KHkV4hVpeXfQu6e-YKatZDiX3ciq4y84iWAqMfs7hEW6XrQBWFRFZAvK2XBtF6kr0VBwB3012D1f6mKoag4q2GxfoaHUYbaRFjvZSHQUc2Wgkh0-J3kraE4xKHvuteEVpha74Y', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHUVoE8lKE84DYLVmP-hekDz6smA953Op1VlvkqA22hCHxpS_TD2Nmd7hiuhbcV3xCt10tiFTBONF1Al2mSP91l_gnn58aezcBvYN2XyI_R0Tr-si-6ICCX74rmpoSP4rq2NoU4YeXgLrBOltPfeqxAEcMP4YNxwJhHhn6Y4YUjty6W0BRUrVAQuko7FcTlUezpYQ0U5adKs7rjJwfQ4MdQjsZvgzqfqXmr5kUDYa2nbWjNz5ghR5rR56TWSxekbt1S6ui75em1PY' },
  { title: 'Illustrations', author: 'Marcus Kane', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUY1Ff_kD8-ov6FS4NMmsH_gQPkosOFSq8_eiJ4lfcKe69YBuc764wBJQQIU38b8dwnBxjWI4dSsYuXJ-ob95mLff0toe7SDaPj6FST5juZXE8hK1qIgcezHw9wN2L19gaDVkzGYbuDil8nU3lwb-1crfGlg822ef3xTXrQcYGY-GInp3tBktHm8PMx5PhJsAvnIgVVVDIoePYKQIk_a5EQSxB1mF5FnJ5jQWbNmMy4lfz4TEPfulkAOLCGkC1NNwRGirdI-zFxK4', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRhqaeGetEy3XfctEalxfNSZ5HGF6VqmRQpXrEhAVwKr1sCPRJoOPwHv24rgdwfpAntAEFKERcaGBrms8PszxJv1XEVIoDVbpb3F64sUmhNxNnaFsRMwxoWJigj8rHKmZtk0IQjbifd28_N9WN15kE22dQhtPR7oSI9Lx115vUtWyaYanObtfShnx4U_IXlOwSAFYo16n8BNDQwo_cgGZiIbr9eKlItIy6yZJLF0y4mC9-yafY3BjXCcoHcwVAid2FtI7SuIgAcbU' },
  { title: 'Web Development', author: 'Tech Studio', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCH5bM2ZLFNeXxV9wPqZHkYsWyjWGF-42QZTbqFtNZiRs3ctX5TFNmz16Y6I-2qUN7PeU6NIQx_-1VTxB65qTiLWjlfh66Hcy2DgoApcMUAjyQQYk5aXdl7WZD6Z_dwyLQqePLJ6B5zmnnipthMhy_7Xk8j4Mt7okgtSdo7C4adK1wSAx-6ur_iP-nsYi7r6FWvCdkpdP61dW9-FVt9EZA6yb7NC8btlocgXel1oY3l5Qq--MfQejRCAntIEJHXeE9bFTt3Y2WAg0', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACI4MfmCFy9jHh6KbkF_kexqT56SS7S7Wu1mPu78HSqlnF_OjCUoJ2SoGV6rssvLRD4eTvebWasKH8ovyLMR7dAgLKRSsDHSjFgFGMin66SDU1XEPGOcxb-ki31k-FX0eypXEAcYeZQCFAjhYiLZnzwd_qCOGuoBugBeyAOo_Z1FmtGDhaCwXvgpBBx2-_kbxq4KOIpngvOT6qLuJcD-n3rDgeWPVnwRpmcHwz2EAeoRi6AEUdbXx6aZ3a6wzGoeL-EtNzTRcl_kQ' },
];

const trustedLogos = [
  { alt: 'Amazon', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0A41-4_rZ4B8gH6sRAjYT6QuySAkWzCaYUBOKOxHPxrMZd2UWUwqkPWD3olnxDZ4FqVX1Ie-vnyyVkSLLWpGz2kVWNC_M80QPvm_HcMmfYwV77RevX5b1tDuqobgwpITp0JZlXVKIh-ktn7CooMpDvFB-zkekoYBeeNYfzO_ZBprD-1U0MvAap-t6RBkpyK-hAufzVZErjFc1mW19umZ-FFult5XAoD-L5CsCHj_XOzoE6njwUfq8ogDyvAtLqzB4Q5L_gj7mr30' },
  { alt: 'Google', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6lAVwnuHkFwldgObDXZiruLgBVdrhYBHuAiGhH7BlVFb4Z97f3RHMlgc1pPC1rB-mZ2JUNOlYmb08OVZ9fv6T6c9qwu21az84vOBtwlfdagSICVisI_6jB-PK7702mpALFhBsjEUI5uC7d_siHrxag5FvQ8i-vP5XsINRzgbUioih9q4u9JeR6zuq-CBJ_xwuXtDofT0pZHKG29thlGBJZX3B3xeP6M3phrSbC4MrpfTFSoE-mNd0AXSMgXoc-V9kIvWVLRvXFJo' },
  { alt: 'Netflix', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHHmNZ5GJ0mXVjoVFzUYjYwlzKe8DseQxELMaI2o8U0C0Nu5ytT88wgWrd0rNg1vPJph288aKjrOY9dK8MO70DS-BhG_0O9FTuiTlgz4WnCyaL6ziojm9FrLG5_GBx6KxzARd6_S_eDVVbgodUcen4vPUOiqgSxALRrmIcnHDqrw-cHmjYxjKzrzA--VK1xDLzbIBQGCzn0hqDgDiGU04tJIFL6167cC5nPzPuO8zhOdKd-_8e4bMia-Lc-MyAcmaX8XnYiMw7bOo' },
  { alt: 'Meta', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANDhhmLRCVJuATzAo9TfzvpLAOWqBuFbEu1s3n9KRM84o225p5tTmzi3sajtcuy-A1b3Av73Fl46BLShNPH7yAYm3_6nwdufKtxNMvN1Nb0aFfBiubp92J3vZF7wT-YPr1mrDKugjcdI-waHjjfveJI7pVRO8vMkdGqDhiZcAt4F030kKbDkkyADWb0tO2sNTp4uPI_qcuoKVHlctNn8U2ZRnA24SeQYBNZFhhvNHSixd7mQTLtqL0V9HLEGC1lSU-qgdTutTB_6Y' },
  { alt: 'PayPal', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKxMUIF_sS7ih-NcFKsoa-YTC2TizPQhMaDaShXGwvDXQW0kw632W-y4NQqHbIIgopfY4WSjuuLOKF9oiF-8TY4KCCFKy-iOmtxHtL1Oj4re-FSWYgkN4H1diXIPD7GUbqZ5DJotZ3Fxongtpg-o_hWks0Sj13Larl_ceIXkDW8aUQ01_MMOJbYoxIUHvoD_RhnRUteBPyg2sqMv87PggO-UDsl0P81AQQhVK5IJbSq0AGWSUlU5zSIjCGbb-1Ta6Zz_3iKDo36NQ' },
];

/* ──────────────────── Component ──────────────────── */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      <main className="flex flex-col grow" style={{ paddingTop: 72 }}>

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative">
          <div className="flex min-h-[520px] md:min-h-[600px] flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
            <div
              className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbzeUFdVJD4kn0wEhuothMopl__lqh2tF20gg_KLQiEOYF4NVi1jjI-_QXsSIWK1m5NvW8HF9gcnChWFTV3SU6QfF5HwFGFm6KVauRbBtQeAI8TrW8jVOqLkuhKavarc9D2Rle_CcgKwvXzJl2dnb-is81PeAdDl3eSI5YSWlO6Fz6TCu__RF71s44vui4ltzRUGELJJe723u_t_SCwubyJ31uEljrewC3CJddrP6MV9hhJLuScORYrDwd2U5y8jtqfGlgeGovwys')" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-slate-900/40 z-10" />

            <div className="relative z-20 flex flex-col gap-8 text-center px-6 max-w-4xl animate-hero-in">
              <div className="flex flex-col gap-4">
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  Find the perfect <span className="text-primary">freelance</span> services for your business
                </h1>
                <p className="text-slate-300 text-lg md:text-xl font-medium">
                  Work with talented experts around the globe at the right price.
                </p>
              </div>

              {/* Hero Search Bar */}
              <div className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="flex w-full items-stretch rounded-xl h-14 md:h-16 bg-white overflow-hidden shadow-2xl">
                  <div className="text-slate-400 flex items-center justify-center pl-5">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="w-full border-none focus:ring-0 text-slate-900 px-4 text-base md:text-lg font-normal placeholder:text-slate-400 bg-transparent outline-none"
                    placeholder='Try "logo design" or "AI developer"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex items-center p-2">
                    <button type="submit" className="h-full px-6 md:px-10 bg-primary text-slate-900 text-base font-bold rounded-lg transition-all hover:bg-primary/90">
                      Search
                    </button>
                  </div>
                </form>

                <div className="flex flex-wrap justify-center gap-3 mt-4 text-white text-sm">
                  <span className="font-bold opacity-70">Popular:</span>
                  {['Website Design', 'WordPress', 'Logo Design'].map(tag => (
                    <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-all">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
        <section className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto py-8 px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Trusted by:</span>
            <div className="flex flex-wrap justify-center items-center gap-10 grayscale opacity-60">
              {trustedLogos.map(logo => (
                <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6 md:h-8" />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ POPULAR SERVICES ═══════════════════ */}
        <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-16">
          <section>
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Popular professional services</h2>
                <Link href="/search" className="text-primary font-bold hover:underline flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </Reveal>

            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-6 px-6">
              {categoryCards.map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <Link href={card.href} className="flex-none w-64 group cursor-pointer block">
                    <div className="relative h-80 rounded-xl overflow-hidden mb-3">
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent z-10" />
                      <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{card.label}</p>
                        <h3 className="text-white text-xl font-bold">{card.title}</h3>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ═══════════════════ VALUE PROPS ═══════════════════ */}
          <Reveal>
            <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-100 dark:bg-slate-900/30 rounded-3xl p-8 md:p-16">
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl font-black">A whole world of freelance talent at your fingertips</h2>
                {[
                  { title: 'The best for every budget', desc: 'Find high-quality services at every price point. No hourly rates, just project-based pricing.' },
                  { title: 'Quality work done quickly', desc: 'Find the right freelancer to begin working on your project within minutes.' },
                  { title: 'Protected payments, every time', desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work." },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <span className="material-symbols-outlined text-slate-400">check_circle</span>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8oQoaeeFNqmdr9gq9DbiljoXOKTEyeXbmvQVWBAL1f4mte-pn5GcTqFnHTJYmq8G3iJhurMjmiDHXmwIplEn2U4AQh8hkbZoQW5-gWMHm1K6_VTFtoUVQEQZveoemOcccgWs5tRORtl3sTxyOD1BFLCn2iXu8df-Ae3rGHrXKmuo0eC5zcB9_s5mGDCj9EVMN9nw92AXp6l_qgJW1cOSCmTHlylJaqFAhj10DAJamuIMDoSKHcS5HcXY4bvpAIEzCji3vY8Bf9X8"
                  alt="Team celebrating a successful project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                  <button className="size-16 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg transition-transform hover:scale-110">
                    <span className="material-symbols-outlined text-4xl leading-none">play_arrow</span>
                  </button>
                </div>
              </div>
            </section>
          </Reveal>

          {/* ═══════════════════ INSPIRATION ═══════════════════ */}
          <section>
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Get inspired with projects made on GIGLIGO</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {inspirationItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="flex flex-col gap-3 group">
                    <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="text-xs text-slate-500">by {item.author}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="px-6 py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <Reveal>
            <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl font-black">Suddenly, it&apos;s all so easy.</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">Join the millions of businesses using GIGLIGO to find the best talent and get work done fast.</p>
              <div>
                <Link href="/register" className="inline-block bg-primary text-slate-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/10">
                  Join GIGLIGO Now
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <Footer />

      {/* Animations */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-in {
          animation: heroIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .reveal-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-up.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
