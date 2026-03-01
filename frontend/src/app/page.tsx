'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { Reveal } from '@/components/animations/Reveal';
import { ParallaxItem } from '@/components/animations/ParallaxItem';
import { ScrollScaleImage } from '@/components/animations/ScrollScaleImage';
import { TextHighlight } from '@/components/animations/TextHighlight';

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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-text-main font-sans selection:bg-primary selection:text-text-main">
      <Navbar />

      <main className="flex flex-col grow bg-grid">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">

          <Reveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light border border-border-light text-sm font-semibold mb-8 hover:bg-border-light transition-colors">
              <span className="flex size-2 rounded-full bg-primary animate-pulse relative">
                <span className="absolute inset-0 rounded-full bg-primary blur-sm"></span>
              </span>
              Gigligo Network 2026 is Live
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2} className="max-w-5xl z-20">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-text-main mb-6 drop-shadow-sm">
              The <TextHighlight delay={0.8} highlightColor="#FFF200">Pakistan's</TextHighlight> top talent, <br className="hidden md:block" />
              in one place.
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.3} className="max-w-2xl z-20">
            <p className="text-lg md:text-2xl text-text-muted font-medium mb-10 leading-relaxed">
              Scale your business securely. Access on-demand elite freelancers, protected escrow payments, and agency-level tools instantly.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.4} className="z-20 w-full max-w-xl">
            <form onSubmit={handleSearch} className="flex w-full items-center rounded-2xl h-16 md:h-20 bg-white border-2 border-border-light/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:border-border-light group">
              <div className="text-text-muted flex items-center justify-center pl-6 transition-colors group-focus-within:text-text-main">
                <span className="material-symbols-outlined text-3xl">search</span>
              </div>
              <input
                className="w-full h-full border-none focus:ring-0 text-text-main px-4 text-lg md:text-xl font-medium placeholder:text-text-muted/70 bg-transparent outline-none"
                placeholder='Search "mobile app dev"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="px-3">
                <button type="submit" className="h-12 md:h-14 px-8 bg-text-main text-white rounded-xl font-bold text-lg hover:bg-text-main/90 hover:-translate-y-0.5 transition-all active:translate-y-0 shadow-md">
                  Search
                </button>
              </div>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm font-semibold text-text-muted">
              <span>Trending:</span>
              {['AI Automation', 'UI/UX Design', 'Shopify'].map(tag => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="hover:text-text-main transition-colors bg-surface-light px-3 py-1 rounded-full border border-border-light hover:border-primary">
                  {tag}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Floating Parallax Badges around the Hero Image */}
          <div className="relative w-full max-w-6xl mx-auto mt-20 md:mt-32">

            <ParallaxItem offset={-80} className="absolute -top-12 -left-4 md:-left-12 z-30 hidden md:block">
              <div className="bg-white px-5 py-4 rounded-2xl shadow-xl border border-border-light/50 flex items-center gap-3 -rotate-3 hover:rotate-0 transition-all cursor-pointer">
                <div className="size-10 rounded-full bg-[#FFF200] flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-main font-bold">verified</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Top 1%</p>
                  <p className="text-sm font-bold text-text-main">Vetted Talent</p>
                </div>
              </div>
            </ParallaxItem>

            <ParallaxItem offset={50} className="absolute top-32 -right-4 md:-right-16 z-30 hidden md:block">
              <div className="bg-white px-5 py-4 rounded-2xl shadow-xl border border-border-light/50 flex items-center gap-3 rotate-3 hover:rotate-0 transition-all cursor-pointer">
                <div className="flex -space-x-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifsW_ISHpDhS-k_4LVPU-3iTZ9SRTjBVHk51_soNwO7afiLW6D0iGLScYH6vwnSxlt2DJf83DYWxHg9fF5vuEoKESyMSJtac7YFNQRTWUW9z9vbwb8FlLecL3VqJvVRH3MPsG7pd_N4f0iH00y3BM5a1M_OKB4uW_HgRikF1uxwmqAaNx8tnvMcuCq8lS0Z-x8ehrwqm-RENytC0XHsSpXtcwq2cpc003BKepnCfGPljJ9yvYkvLf1lZ-amlYm5MvXXOY7-xBq9w" className="size-10 rounded-full border-2 border-white object-cover" alt="User" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHUVoE8lKE84DYLVmP-hekDz6smA953Op1VlvkqA22hCHxpS_TD2Nmd7hiuhbcV3xCt10tiFTBONF1Al2mSP91l_gnn58aezcBvYN2XyI_R0Tr-si-6ICCX74rmpoSP4rq2NoU4YeXgLrBOltPfeqxAEcMP4YNxwJhHhn6Y4YUjty6W0BRUrVAQuko7FcTlUezpYQ0U5adKs7rjJwfQ4MdQjsZvgzqfqXmr5kUDYa2nbWjNz5ghR5rR56TWSxekbt1S6ui75em1PY" className="size-10 rounded-full border-2 border-white object-cover" alt="User" />
                  <div className="size-10 rounded-full border-2 border-white bg-text-main text-white flex items-center justify-center text-xs font-bold">+2k</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main">Hired Today</p>
                </div>
              </div>
            </ParallaxItem>

            <ScrollScaleImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbzeUFdVJD4kn0wEhuothMopl__lqh2tF20gg_KLQiEOYF4NVi1jjI-_QXsSIWK1m5NvW8HF9gcnChWFTV3SU6QfF5HwFGFm6KVauRbBtQeAI8TrW8jVOqLkuhKavarc9D2Rle_CcgKwvXzJl2dnb-is81PeAdDl3eSI5YSWlO6Fz6TCu__RF71s44vui4ltzRUGELJJe723u_t_SCwubyJ31uEljrewC3CJddrP6MV9hhJLuScORYrDwd2U5y8jtqfGlgeGovwys"
              alt="Gigligo Dashboard Platform"
              startScale={0.85}
              className="z-10 ring-1 ring-text-main/10 rounded-2xl md:rounded-4xl overflow-hidden"
            />
          </div>

        </section>

        {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
        <Reveal direction="up" delay={0.2} className="w-full relative z-10 -mt-10 md:-mt-20">
          <section className="bg-transparent text-center flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto w-full py-8 px-6 flex flex-col items-center justify-center gap-6 md:gap-8 border-b border-border-light">
              <span className="text-text-muted font-bold text-sm uppercase tracking-widest text-center">Trusted by world-class teams</span>
              <div className="flex flex-wrap justify-center items-center gap-10 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                {trustedLogos.map(logo => (
                  <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6 md:h-8 object-contain mix-blend-multiply" />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ═══════════════════ POPULAR SERVICES ═══════════════════ */}
        <div className="max-w-7xl mx-auto w-full px-6 py-24 flex flex-col gap-32 items-center justify-center overflow-hidden">
          <section className="w-full flex flex-col items-center text-center">
            <Reveal direction="up" className="w-full flex flex-col items-center text-center pb-12">
              <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
                <h2 className="text-4xl md:text-5xl font-black text-text-main text-center tracking-tight">Popular professional services</h2>
                <Link href="/search" className="text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-2">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </Reveal>

            <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar w-full md:justify-center px-4 snap-x">
              {categoryCards.map((card, i) => (
                <Reveal direction="up" key={card.title} delay={0.1 * (i + 1)} className="flex-none snap-center">
                  <Link href={card.href} className="w-64 md:w-56 lg:w-48 group cursor-pointer flex flex-col items-center text-center">
                    <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden mb-4 shadow-lg border border-border-light/50">
                      <div className="absolute inset-0 bg-linear-to-t from-text-main/90 via-text-main/20 to-transparent z-10" />
                      <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center text-center px-4">
                        <p className="text-[#FFF200] text-xs font-bold uppercase tracking-widest mb-1.5">{card.label}</p>
                        <h3 className="text-white text-xl font-bold leading-tight">{card.title}</h3>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ═══════════════════ VALUE PROPS ═══════════════════ */}
          <section className="flex flex-col gap-16 items-center justify-center w-full max-w-6xl mx-auto py-12">
            <Reveal direction="up">
              <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
                <h2 className="text-4xl md:text-6xl font-black text-center max-w-4xl leading-tight tracking-tight text-text-main drop-shadow-sm">
                  A whole world of freelance talent <br className="hidden md:block" />
                  <TextHighlight delay={0.3} highlightColor="#e2e8f0">at your fingertips.</TextHighlight>
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-12 w-full max-w-5xl mt-6">
              {[
                { title: 'The best for every budget', desc: 'Find high-quality services at every price point. No hourly rates, just project-based pricing.', icon: 'payments' },
                { title: 'Quality work done quickly', desc: 'Find the right freelancer to begin working on your project within minutes.', icon: 'bolt' },
                { title: 'Protected payments, every time', desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work.", icon: 'shield' },
              ].map((item, i) => (
                <Reveal direction="up" delay={0.2 * (i + 1)} key={item.title}>
                  <div className="flex flex-col items-center justify-start gap-5 text-center p-6 rounded-3xl bg-white border border-border-light/50 shadow-xl hover:-translate-y-2 transition-transform duration-500">
                    <div className="size-16 rounded-2xl bg-text-main flex items-center justify-center text-[#FFF200] shadow-md">
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <h4 className="text-xl font-bold text-text-main leading-snug">{item.title}</h4>
                      <p className="text-text-muted text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal direction="up" delay={0.4} className="w-full">
              <div className="relative rounded-4xl overflow-hidden aspect-21/9 shadow-2xl w-full max-w-5xl mx-auto mt-8 group cursor-pointer ring-1 ring-text-main/10 bg-surface-light">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8oQoaeeFNqmdr9gq9DbiljoXOKTEyeXbmvQVWBAL1f4mte-pn5GcTqFnHTJYmq8G3iJhurMjmiDHXmwIplEn2U4AQh8hkbZoQW5-gWMHm1K6_VTFtoUVQEQZveoemOcccgWs5tRORtl3sTxyOD1BFLCn2iXu8df-Ae3rGHrXKmuo0eC5zcB9_s5mGDCj9EVMN9nw92AXp6l_qgJW1cOSCmTHlylJaqFAhj10DAJamuIMDoSKHcS5HcXY4bvpAIEzCji3vY8Bf9X8"
                  alt="Team celebrating a successful project"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-text-main/20 hover:bg-text-main/10 transition-colors duration-500 backdrop-blur-[2px] hover:backdrop-blur-none">
                  <button className="size-20 md:size-24 rounded-full bg-[#FFF200] flex items-center justify-center text-text-main shadow-[0_0_40px_rgba(255,206,153,0.4)] transition-transform duration-500 hover:scale-110">
                    <span className="material-symbols-outlined text-5xl md:text-6xl pl-1">play_arrow</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ═══════════════════ INSPIRATION ═══════════════════ */}
          <section className="w-full flex flex-col items-center max-w-7xl mx-auto py-24 px-6 overflow-hidden">
            <Reveal direction="up" className="w-full flex flex-col items-center text-center pb-12">
              <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
                <h2 className="text-4xl md:text-5xl font-black text-text-main text-center tracking-tight">
                  <TextHighlight delay={0.2} highlightColor="#e2e8f0">Inspiring</TextHighlight> projects on Gigligo
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 w-full justify-items-center">
              {inspirationItems.map((item, i) => (
                <Reveal direction="up" key={item.title} delay={0.1 * (i + 1)} className="flex flex-col items-center text-center w-full">
                  <div className="flex flex-col items-center gap-5 group w-full cursor-pointer">
                    <div className="aspect-square w-full bg-surface-light rounded-3xl overflow-hidden shadow-md ring-1 ring-text-main/10">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                      <div className="size-12 rounded-full bg-border-light overflow-hidden shadow-sm border-2 border-white">
                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-sm font-medium text-text-muted mt-1">by {item.author}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="px-6 py-32 md:py-48 bg-text-main text-white relative overflow-hidden flex flex-col items-center justify-center text-center w-full mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          <div className="absolute top-0 w-[200%] h-px bg-linear-to-r from-transparent via-text-main/80 to-transparent" />
          <div className="absolute right-1/2 top-1/2 w-full max-w-4xl h-full bg-[#FFF200]/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <Reveal direction="up" className="w-full flex flex-col items-center justify-center relative z-10 text-center mx-auto max-w-5xl">
            <div className="flex flex-col items-center justify-center gap-10 w-full">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-center leading-[1.05] tracking-tight">
                Suddenly, <br className="hidden md:block" />it's all so <span className="text-[#FFF200]">easy.</span>
              </h2>
              <p className="text-text-muted text-xl md:text-2xl font-medium text-center max-w-2xl px-4 leading-relaxed">
                Join the millions of businesses using GIGLIGO to find the best talent and scale their operations securely.
              </p>
              <div className="mt-8 flex justify-center w-full">
                <Link href="/register" className="inline-flex items-center justify-center bg-[#FFF200] text-text-main px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#FFF200]/10 group">
                  Start Hiring Now
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
