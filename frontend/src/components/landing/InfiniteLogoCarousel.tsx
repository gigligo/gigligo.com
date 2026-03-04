'use client';

import { motion } from 'framer-motion';

const trustedLogos = [
    { alt: 'Amazon', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0A41-4_rZ4B8gH6sRAjYT6QuySAkWzCaYUBOKOxHPxrMZd2UWUwqkPWD3olnxDZ4FqVX1Ie-vnyyVkSLLWpGz2kVWNC_M80QPvm_HcMmfYwV77RevX5b1tDuqobgwpITp0JZlXVKIh-ktn7CooMpDvFB-zkekoYBeeNYfzO_ZBprD-1U0MvAap-t6RBkpyK-hAufzVZErjFc1mW19umZ-FFult5XAoD-L5CsCHj_XOzoE6njwUfq8ogDyvAtLqzB4Q5L_gj7mr30' },
    { alt: 'Google', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6lAVwnuHkFwldgObDXZiruLgBVdrhYBHuAiGhH7BlVFb4Z97f3RHMlgc1pPC1rB-mZ2JUNOlYmb08OVZ9fv6T6c9qwu21az84vOBtwlfdagSICVisI_6jB-PK7702mpALFhBsjEUI5uC7d_siHrxag5FvQ8i-vP5XsINRzgbUioih9q4u9JeR6zuq-CBJ_xwuXtDofT0pZHKG29thlGBJZX3B3xeP6M3phrSbC4MrpfTFSoE-mNd0AXSMgXoc-V9kIvWVLRvXFJo' },
    { alt: 'Netflix', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHHmNZ5GJ0mXVjoVFzUYjYwlzKe8DseQxELMaI2o8U0C0Nu5ytT88wgWrd0rNg1vPJph288aKjrOY9dK8MO70DS-BhG_0O9FTuiTlgz4WnCyaL6ziojm9FrLG5_GBx6KxzARd6_S_eDVVbgodUcen4vPUOiqgSxALRrmIcnHDqrw-cHmjYxjKzrzA--VK1xDLzbIBQGCzn0hqDgDiGU04tJIFL6167cC5nPzPuO8zhOdKd-_8e4bMia-Lc-MyAcmaX8XnYiMw7bOo' },
    { alt: 'Meta', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANDhhmLRCVJuATzAo9TfzvpLAOWqBuFbEu1s3n9KRM84o225p5tTmzi3sajtcuy-A1b3Av73Fl46BLShNPH7yAYm3_6nwdufKtxNMvN1Nb0aFfBiubp92J3vZF7wT-YPr1mrDKugjcdI-waHjjfveJI7pVRO8vMkdGqDhiZcAt4F030kKbDkkyADWb0tO2sNTp4uPI_qcuoKVHlctNn8U2ZRnA24SeQYBNZFhhvNHSixd7mQTLtqL0V9HLEGC1lSU-qgdTutTB_6Y' },
    { alt: 'PayPal', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKxMUIF_sS7ih-NcFKsoa-YTC2TizPQhMaDaShXGwvDXQW0kw632W-y4NQqHbIIgopfY4WSjuuLOKF9oiF-8TY4KCCFKy-iOmtxHtL1Oj4re-FSWYgkN4H1diXIPD7GUbqZ5DJotZ3Fxongtpg-o_hWks0Sj13Larl_ceIXkDW8aUQ01_MMOJbYoxIUHvoD_RhnRUteBPyg2sqMv87PggO-UDsl0P81AQQhVK5IJbSq0AGWSUlU5zSIjCGbb-1Ta6Zz_3iKDo36NQ' },
];

export function InfiniteLogoCarousel() {
    // Duplicate the array twice so that the animation is completely seamless
    // when using Framer Motion's basic animation loop.
    const carouselItems = [...trustedLogos, ...trustedLogos, ...trustedLogos];

    return (
        <section className="py-12 bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                <span className="text-text-muted font-bold text-sm uppercase tracking-widest text-center">Trusted by world-class teams</span>
            </div>

            <div className="flex w-[300%] sm:w-[200%] md:w-[150%]">
                <motion.div
                    className="flex shrink-0 items-center justify-around w-full"
                    animate={{
                        x: ['0%', '-33.333%'] // Move exactly one third (one original copy) to loop perfectly
                    }}
                    transition={{
                        ease: "linear",
                        duration: 20,
                        repeat: Infinity,
                    }}
                >
                    {carouselItems.map((logo, idx) => (
                        <div key={`${logo.alt}-${idx}`} className="px-8 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                            <img src={logo.src} alt={logo.alt} className="h-6 md:h-8 lg:h-10 object-contain mix-blend-multiply" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
