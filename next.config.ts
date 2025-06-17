import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Add proper redirects to handle common redirect issues
  async redirects() {
    return [
      // Redirect /blog to /blogs for consistency (permanent redirect)
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      // Redirect /blog/:slug to /blogs/:slug for consistency (permanent redirect)  
      {
        source: '/blog/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      // Handle trailing slashes - remove them for consistency
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
