'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { motion } from 'framer-motion';

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

      <main className="flex flex-col grow">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">

          {/* Minimal Blue Mesh Blur Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none z-0" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light/80 backdrop-blur-md border border-border-light text-sm font-semibold mb-8 z-20"
          >
            <span className="flex size-2 rounded-full bg-primary relative">
              <span className="absolute inset-0 rounded-full bg-primary blur-[2px]"></span>
            </span>
            Gigligo Network 2026 is Live
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="max-w-4xl z-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-text-main mb-6">
              The Pakistan&apos;s top talent, <br className="hidden md:block" />
              in one place.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="max-w-2xl z-20"
          >
            <p className="text-lg md:text-xl text-text-muted font-medium mb-10 leading-relaxed">
              Scale your business securely. Access on-demand elite freelancers, protected escrow payments, and agency-level tools instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="z-20 w-full max-w-2xl"
          >
            <form onSubmit={handleSearch} className="flex w-full items-center rounded-3xl h-14 md:h-[72px] bg-white border border-border-light/80 shadow-sm hover:shadow-lg hover:border-border-light transition-all duration-300 group overflow-hidden pl-2 pr-2">
              <div className="text-text-muted flex items-center justify-center pl-4 transition-colors group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[28px]">search</span>
              </div>
              <input
                className="w-full h-full border-none focus:ring-0 text-text-main px-4 text-base md:text-xl font-medium placeholder:text-text-muted/50 bg-transparent outline-none"
                placeholder='Try "Mobile App Developer"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="px-1 py-1 h-full flex items-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} type="submit" className="h-full px-8 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-md">
                  Search
                </motion.button>
              </div>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-sm font-semibold text-text-muted">
              <span>Trending:</span>
              {['AI Automation', 'UI/UX Design', 'Shopify'].map(tag => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="hover:text-primary hover:bg-primary/5 transition-colors bg-surface-light px-4 py-1.5 rounded-full border border-border-light">
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Hero Image + Floating Badges */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-5xl mx-auto mt-20 md:mt-32 z-10"
          >

            {/* Vetted Talent Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ delay: 0.8, type: "spring", damping: 12 }}
              className="absolute -top-10 -left-4 md:-left-12 z-30 hidden md:block"
            >
              <div className="bg-white px-5 py-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border-light flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined font-bold text-[28px]">verified</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-0.5">Top 1%</p>
                  <p className="text-base font-bold text-text-main">Vetted Talent</p>
                </div>
              </div>
            </motion.div>

            {/* Hired Today Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{ delay: 1, type: "spring", damping: 12 }}
              className="absolute bottom-16 -right-4 md:-right-16 z-30 hidden md:block"
            >
              <div className="bg-white px-5 py-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border-light flex items-center gap-4">
                <div className="flex -space-x-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifsW_ISHpDhS-k_4LVPU-3iTZ9SRTjBVHk51_soNwO7afiLW6D0iGLScYH6vwnSxlt2DJf83DYWxHg9fF5vuEoKESyMSJtac7YFNQRTWUW9z9vbwb8FlLecL3VqJvVRH3MPsG7pd_N4f0iH00y3BM5a1M_OKB4uW_HgRikF1uxwmqAaNx8tnvMcuCq8lS0Z-x8ehrwqm-RENytC0XHsSpXtcwq2cpc003BKepnCfGPljJ9yvYkvLf1lZ-amlYm5MvXXOY7-xBq9w" className="size-12 rounded-full border-[3px] border-white object-cover shadow-sm bg-surface-light" alt="User" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHUVoE8lKE84DYLVmP-hekDz6smA953Op1VlvkqA22hCHxpS_TD2Nmd7hiuhbcV3xCt10tiFTBONF1Al2mSP91l_gnn58aezcBvYN2XyI_R0Tr-si-6ICCX74rmpoSP4rq2NoU4YeXgLrBOltPfeqxAEcMP4YNxwJhHhn6Y4YUjty6W0BRUrVAQuko7FcTlUezpYQ0U5adKs7rjJwfQ4MdQjsZvgzqfqXmr5kUDYa2nbWjNz5ghR5rR56TWSxekbt1S6ui75em1PY" className="size-12 rounded-full border-[3px] border-white object-cover shadow-sm bg-surface-light" alt="User" />
                  <div className="size-12 rounded-full border-[3px] border-white bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">+2k</div>
                </div>
                <div>
                  <p className="text-base font-bold text-text-main">Hired Today</p>
                </div>
              </div>
            </motion.div>

            <div className="relative z-10 w-full mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-white p-2 border border-border-light/50">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="3 people collaborating at a table on a Gigligo project"
                className="w-full h-auto rounded-3xl object-cover aspect-21/9"
              />
            </div>

          </motion.div>

        </section>

        {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
        <div className="w-full relative z-10 mt-12 md:mt-24">
          <section className="bg-transparent text-center flex flex-col items-center justify-center">
            <div className="max-w-5xl mx-auto w-full py-8 px-6 flex flex-col items-center justify-center gap-8">
              <span className="text-text-muted font-bold text-sm uppercase tracking-widest text-center">Trusted by world-class teams</span>
              <div className="flex flex-wrap justify-center items-center gap-10 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                {trustedLogos.map(logo => (
                  <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6 md:h-8 object-contain mix-blend-multiply" />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════════════ POPULAR SERVICES ═══════════════════ */}
        <div className="max-w-[1400px] mx-auto w-full px-6 py-32 flex flex-col gap-32 items-center justify-center overflow-hidden">
          <section className="w-full flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full flex flex-col items-center text-center pb-16"
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-text-main text-center tracking-tight">Popular professional services</h2>
                <Link href="/search" className="text-primary font-bold hover:text-primary-dark transition-colors flex items-center justify-center gap-1 mt-4 text-lg">
                  View All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="flex overflow-x-auto gap-8 pb-8 no-scrollbar w-full md:justify-center px-4 snap-x"
            >
              {categoryCards.map((card) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 100 } }
                  }}
                  key={card.title}
                  className="flex-none snap-center"
                >
                  <Link href={card.href} className="w-[280px] md:w-[240px] lg:w-[220px] group cursor-pointer flex flex-col items-center text-center">
                    <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden mb-4 shadow-sm border border-border-light/50 transition-all duration-500 group-hover:shadow-[0_10px_40px_rgba(0,124,255,0.15)] group-hover:-translate-y-2">
                      <div className="absolute inset-0 bg-linear-to-t from-text-main/80 via-transparent to-transparent z-10 transition-opacity group-hover:opacity-90" />
                      <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-start text-left px-6">
                        <h3 className="text-white text-2xl font-bold leading-tight drop-shadow-md">{card.title}</h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════════════ VALUE PROPS ═══════════════════ */}
          <section className="flex flex-col gap-20 items-center justify-center w-full max-w-6xl mx-auto py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center justify-center gap-6 w-full text-center"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-[1.1] tracking-tight text-text-main">
                A whole world of freelance talent <br className="hidden md:block" />
                <span className="text-text-muted">at your fingertips.</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="grid md:grid-cols-3 gap-8 w-full max-w-5xl"
            >
              {[
                { title: 'The best for every budget', desc: 'Find high-quality services at every price point. No hourly rates, just project-based pricing.', icon: 'payments' },
                { title: 'Quality work done quickly', desc: 'Find the right freelancer to begin working on your project within minutes.', icon: 'bolt' },
                { title: 'Protected payments', desc: "Always know what you'll pay upfront. Your payment isn't released until approved.", icon: 'shield' },
              ].map((item) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 14 } }
                  }}
                  key={item.title}
                  className="flex flex-col items-center justify-start gap-6 text-center p-10 rounded-2xl bg-surface-light border border-border-light shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[40px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <h4 className="text-2xl font-bold text-text-main leading-snug">{item.title}</h4>
                    <p className="text-text-muted text-lg font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════════════ INSPIRATION ═══════════════════ */}
          <section className="w-full flex flex-col items-center max-w-7xl mx-auto py-16 px-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full flex flex-col items-center text-center pb-16"
            >
              <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-text-main text-center tracking-tight">
                  <span className="text-text-muted">Inspiring</span> projects on Gigligo
                </h2>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 w-full justify-items-center"
            >
              {inspirationItems.map((item) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 30 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15 } }
                  }}
                  key={item.title}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="flex flex-col items-center gap-6 group w-full cursor-pointer">
                    <div className="aspect-square w-full bg-surface-light rounded-2xl overflow-hidden shadow-sm border border-border-light group-hover:shadow-lg transition-all duration-500">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                      <div className="size-14 rounded-full bg-surface-light overflow-hidden shadow-sm border-[3px] border-white">
                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-base font-medium text-text-muted mt-1">by {item.author}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="px-6 py-32 md:py-48 bg-text-main text-white relative overflow-hidden flex flex-col items-center justify-center text-center w-full mt-12">

          <div className="absolute right-1/2 top-1/2 w-full max-w-4xl h-full bg-primary/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-full flex flex-col items-center justify-center relative z-10 text-center mx-auto max-w-5xl"
          >
            <div className="flex flex-col items-center justify-center gap-10 w-full">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.05] tracking-tight">
                Suddenly, <br className="hidden md:block" />it&apos;s all so <span className="text-primary drop-shadow-sm">easy.</span>
              </h2>
              <p className="text-white/70 text-xl md:text-2xl font-medium text-center max-w-2xl px-4 leading-relaxed">
                Join the millions of businesses using GIGLIGO to find the best talent and scale their operations securely.
              </p>
              <div className="mt-10 flex justify-center w-full">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="inline-flex items-center justify-center bg-primary text-white px-12 py-5 rounded-3xl font-bold text-xl hover:bg-primary-dark shadow-[0_10px_40px_rgba(0,124,255,0.4)] transition-colors group"
                  >
                    Start Hiring Now
                    <span className="material-symbols-outlined ml-3 text-[24px]">arrow_forward</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
