/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Add redirects to handle common redirect issues
    async redirects() {
        return [
            // Redirect from blog.andriifurmanets.com to andriifurmanets.com/blogs if needed
            {
                source: '/',
                has: [
                    {
                        type: 'host',
                        value: 'blog.andriifurmanets.com',
                    },
                ],
                destination: 'https://andriifurmanets.com/blogs',
                permanent: true,
            },
            // Redirect from URLs with trailing index.html
            {
                source: '/:path*/index.html',
                destination: '/:path*',
                permanent: true,
            },
            // Redirect /blog to /blogs for consistency
            {
                source: '/blog',
                destination: '/blogs',
                permanent: true,
            },
            // Redirect /blog/:slug to /blogs/:slug for consistency
            {
                source: '/blog/:slug',
                destination: '/blogs/:slug',
                permanent: true,
            },
        ];
    },

    // Add rewrites if needed
    async rewrites() {
        return [];
    },
};

module.exports = nextConfig; 