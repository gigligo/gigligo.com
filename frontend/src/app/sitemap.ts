import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Dynamic gig pages (fetch from API)
    let gigPages: MetadataRoute.Sitemap = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/gig/featured`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const gigs = await res.json();
            gigPages = (gigs || []).map((gig: any) => ({
                url: `${BASE_URL}/gig/${gig.id}`,
                lastModified: new Date(gig.updatedAt || gig.createdAt),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch { /* API may not be available during build */ }

    return [...staticPages, ...gigPages];
}
