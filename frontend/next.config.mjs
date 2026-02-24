/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/images/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=2592000, immutable',
                    },
                ],
            },
            {
                // Add cache control for fonts if any are served from public
                source: '/fonts/:all*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
