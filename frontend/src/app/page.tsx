'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/landing/Hero';
import { InfiniteLogoCarousel } from '@/components/landing/InfiniteLogoCarousel';
import { ModularFeatures } from '@/components/landing/ModularFeatures';
import { InteractiveStats } from '@/components/landing/InteractiveStats';
import { PortfolioShowcase } from '@/components/landing/PortfolioShowcase';
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
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-text-main font-sans selection:bg-primary selection:text-text-main">
      <Navbar />

      <main className="flex flex-col grow">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <Hero />

        {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
        <InfiniteLogoCarousel />

        {/* ═══════════════════ MODULAR FEATURES ═══════════════════ */}
        <ModularFeatures />

        {/* ═══════════════════ INTERACTIVE STATS ═══════════════════ */}
        <InteractiveStats />

        {/* ═══════════════════ PORTFOLIO SHOWCASE ═══════════════════ */}
        <PortfolioShowcase />

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
