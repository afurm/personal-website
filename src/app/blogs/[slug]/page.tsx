import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug, getReadingTime, getRelatedPosts } from '../../../lib/blog';
import Script from 'next/script';
import { BlogPostClient } from '../../../components/pages/BlogPostClient';

// Define the params type to match Next.js expectations
type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    const canonicalUrl = `https://andriifurmanets.com/blogs/${slug}`;

    return {
        title: `${post.title} | Andrii Furmanets`,
        description: post.description,
        keywords: post.tags.join(', '),
        authors: [{ name: 'Andrii Furmanets', url: 'https://andriifurmanets.com' }],
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            modifiedTime: post.date,
            tags: post.tags,
            url: canonicalUrl,
            siteName: 'Andrii Furmanets',
            authors: ['Andrii Furmanets'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            creator: '@andriifurmanets',
        },
        alternates: {
            canonical: canonicalUrl,
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
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
    const posts = await getAllBlogPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
        notFound();
    }

    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const readingTime = getReadingTime(post.content);
    const relatedPosts = await getRelatedPosts(post);
    const canonicalUrl = `https://andriifurmanets.com/blogs/${slug}`;

    // Create structured data for the blog post
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
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
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
        },
        url: canonicalUrl,
        keywords: post.tags.join(', '),
        articleSection: 'Technology',
        wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
    };

    return (
        <>
            {/* Add canonical link */}
            <link rel="canonical" href={canonicalUrl} />
            
            {/* Add structured data script */}
            <Script
                id="blog-post-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <BlogPostClient 
                post={post}
                readingTime={readingTime}
                relatedPosts={relatedPosts}
                canonicalUrl={canonicalUrl}
            />
        </>
    );
} 