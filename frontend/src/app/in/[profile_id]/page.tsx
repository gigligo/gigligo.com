import { Metadata } from 'next';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.gigligo.com';

interface Props {
    params: Promise<{ profile_id: string }>;
}

/**
 * Generate SEO metadata for the public profile page.
 * This enables OG tags, Twitter cards, and rich search results.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { profile_id } = await params;

    try {
        const res = await fetch(`${API_URL}/api/profile/public/${profile_id}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            return {
                title: 'Profile Not Found | Gigligo',
                description: 'This profile could not be found on Gigligo.',
            };
        }

        const profile = await res.json();
        const name = profile.fullName || 'Freelancer';
        const title = profile.headline || profile.bio?.slice(0, 60) || 'Freelancer on Gigligo';
        const skills = (profile.skills || []).slice(0, 5).join(', ');
        const description = profile.bio
            ? `${profile.bio.slice(0, 150)}${profile.bio.length > 150 ? '...' : ''}`
            : `${name} is a freelancer on Gigligo specializing in ${skills || 'various skills'}.`;

        return {
            title: `${name} — ${title} | Gigligo`,
            description,
            openGraph: {
                title: `${name} — ${title}`,
                description,
                type: 'profile',
                url: `https://www.gigligo.com/in/${profile_id}`,
                images: profile.avatarUrl ? [{ url: profile.avatarUrl, width: 400, height: 400 }] : [],
                siteName: 'Gigligo',
            },
            twitter: {
                card: 'summary',
                title: `${name} — ${title}`,
                description,
                images: profile.avatarUrl ? [profile.avatarUrl] : [],
            },
            alternates: {
                canonical: `https://www.gigligo.com/in/${profile_id}`,
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch {
        return {
            title: 'Freelancer Profile | Gigligo',
            description: 'View freelancer profiles on Gigligo — Pakistan\'s top talent marketplace.',
        };
    }
}

/**
 * The /in/[profile_id] route redirects to /profile/[profile_id].
 * SEO metadata is generated server-side above, so crawlers get full OG tags.
 * Users are redirected to the full interactive profile page.
 */
export default async function LinkedInStyleProfilePage({ params }: Props) {
    const { profile_id } = await params;
    redirect(`/profile/${profile_id}`);
}
