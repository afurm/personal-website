import { Metadata } from 'next';
import { getAllBlogPosts, getAllTags } from '../../lib/blog';
import Script from 'next/script';
import { BlogsPageClient } from '../../components/pages/BlogsPageClient';

export const metadata: Metadata = {
    title: 'Blog | Andrii Furmanets - Web Development & Technology Insights',
    description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology. Explore articles about React, Next.js, Rails, and more.',
    keywords: 'web development, programming, React, Next.js, Ruby on Rails, JavaScript, TypeScript, technology, tutorials',
    authors: [{ name: 'Andrii Furmanets', url: 'https://andriifurmanets.com' }],
    openGraph: {
        title: 'Blog | Andrii Furmanets',
        description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
        type: 'website',
        url: 'https://andriifurmanets.com/blogs',
        siteName: 'Andrii Furmanets',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | Andrii Furmanets',
        description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
        creator: '@andriifurmanets',
    },
    alternates: {
        canonical: 'https://andriifurmanets.com/blogs',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function BlogsPage() {
    const posts = await getAllBlogPosts();
    const allTags = await getAllTags();

    // Create structured data for blog list
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        headline: 'Blog Posts | Andrii Furmanets',
        description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
        url: 'https://andriifurmanets.com/blogs',
        author: {
            '@type': 'Person',
            name: 'Andrii Furmanets',
            url: 'https://andriifurmanets.com',
        },
        publisher: {
            '@type': 'Person',
            name: 'Andrii Furmanets',
            url: 'https://andriifurmanets.com',
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://andriifurmanets.com/blogs/${post.slug}`,
                name: post.title,
            })),
        },
    };

    return (
        <>
            {/* Add canonical link */}
            <link rel="canonical" href="https://andriifurmanets.com/blogs" />
            
            {/* Add structured data script */}
            <Script
                id="blog-list-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <BlogsPageClient initialPosts={posts} allTags={allTags} />
        </>
    );
} 