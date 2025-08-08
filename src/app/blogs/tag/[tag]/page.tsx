import Link from 'next/link';
import { Metadata } from 'next';
import { getAllTags, getBlogPostsByTag } from '../../../../lib/blog';
import { formatDate } from '../../../../lib/utils';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import TagsFilter from '../../../../components/ui/TagsFilter';

// Define the params type to match Next.js expectations
type PageProps = {
    params: Promise<{
        tag: string;
    }>;
};

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const tag = resolvedParams.tag;

    if (!tag) {
        return {
            title: 'Tag Not Found',
        };
    }

    const decodedTag = decodeURIComponent(tag);

    const encodedTag = encodeURIComponent(decodedTag.toLowerCase());

    return {
        title: `${decodedTag} Articles | Andrii Furmanets`,
        description: `Browse all blog posts related to ${decodedTag}.`,
        openGraph: {
            title: `${decodedTag} Articles | Andrii Furmanets`,
            description: `Browse all blog posts related to ${decodedTag}.`,
            type: 'website',
            url: `https://andriifurmanets.com/blogs/tag/${encodedTag}`,
        },
        alternates: {
            canonical: `https://andriifurmanets.com/blogs/tag/${encodedTag}`,
        },
        robots: {
            index: false,
            follow: true,
            googleBot: {
                index: false,
                follow: true,
            },
        },
    };
}

// Generate static paths for all tags
export async function generateStaticParams() {
    const tags = await getAllTags();

    return tags.map((tag) => ({
        tag,
    }));
}

export default async function TagPage({ params }: PageProps) {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const tag = resolvedParams.tag;

    if (!tag) {
        notFound();
    }

    const decodedTag = decodeURIComponent(tag);
    const encodedCanonical = encodeURIComponent(decodedTag.toLowerCase());
    const posts = await getBlogPostsByTag(decodedTag);
    const allTags = await getAllTags();

    if (posts.length === 0) {
        notFound();
    }

    // Create structured data for tag page
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        headline: `${decodedTag} Blog Posts | My Personal Website`,
        description: `Browse all blog posts related to ${decodedTag}.`,
        url: `https://andriifurmanets.com/blogs/tag/${encodedCanonical}`,
        author: {
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
        <div className="container mx-auto px-4 py-12">
            {/* Add structured data script */}
            <Script
                id="tag-page-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Link
                href="/blogs"
                className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to all blogs
            </Link>

            <h1 className="text-4xl font-bold mb-8">
                Posts tagged with <span className="text-blue-600 dark:text-blue-400">{decodedTag}</span>
            </h1>

            {/* Add TagsFilter component */}
            <div className="relative mb-8">
                <TagsFilter tags={allTags} baseUrl="/blogs/tag" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <article
                        key={post.slug}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Link href={`/blogs/${post.slug}`}>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <time className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(post.date)}
                                    </time>
                                </div>

                                <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {post.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {post.tags.slice(0, 3).map(t => (
                                        <span
                                            key={t}
                                            className={`px-2 py-1 rounded-full text-xs ${t === decodedTag
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                                }`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                            +{post.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}