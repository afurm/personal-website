import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug, getReadingTime, getRelatedPosts } from '../../../lib/blog';
import { formatDate } from '../../../lib/utils';
import Script from 'next/script';

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
            
            <div className="container mx-auto px-4 py-12">
                {/* Add structured data script */}
                <Script
                    id="blog-post-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />

                <Link
                    href="/blogs"
                    className="inline-flex items-center mb-8 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to all blogs
                </Link>

                <article className="max-w-3xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
                            <time className="flex items-center" dateTime={post.date}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {formatDate(post.date)}
                            </time>

                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                {readingTime} min read
                            </span>
                        </div>
                    </header>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags section moved below the article content */}
                    <div className="mt-8 mb-8">
                        <h3 className="text-lg font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/blogs/tag/${tag}`}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {relatedPosts.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.map(relatedPost => (
                                    <Link
                                        key={relatedPost.slug}
                                        href={`/blogs/${relatedPost.slug}`}
                                        className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {relatedPost.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </>
    );
} 