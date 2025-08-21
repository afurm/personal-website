import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug, getReadingTime, getRelatedPosts } from '../../../lib/blog';
import { BlogPostClient } from '../../../components/pages/BlogPostClient';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { BlogStructuredData } from '@/components/ui/blog-structured-data';

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

    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blogs' },
        { name: post.title, href: `/blogs/${slug}` },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 pt-20 md:pt-24">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                <BlogPostClient 
                    post={post}
                    readingTime={readingTime}
                    relatedPosts={relatedPosts}
                    canonicalUrl={canonicalUrl}
                />
            </main>
            <Footer />
            <BlogStructuredData 
                post={post} 
                canonicalUrl={canonicalUrl} 
                readingTime={readingTime} 
            />
        </div>
    );
} 