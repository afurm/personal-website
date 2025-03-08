import Link from 'next/link';
import { Metadata } from 'next';
import { getAllBlogPosts, getAllTags } from '../../lib/blog';
import { formatDate } from '../../lib/utils';
import Script from 'next/script';
import TagsFilter from '../../components/ui/TagsFilter';

export const metadata: Metadata = {
    title: 'Blog | My Personal Website',
    description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
    openGraph: {
        title: 'Blog | My Personal Website',
        description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
        type: 'website',
    },
    alternates: {
        canonical: 'https://andriifurmanets.com/blogs',
    },
};

export default async function BlogsPage() {
    const posts = await getAllBlogPosts();
    const allTags = await getAllTags();

    // Create structured data for blog list
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        headline: 'Blog Posts | My Personal Website',
        description: 'Read my latest thoughts, tutorials, and insights on web development, programming, and technology.',
        url: 'https://andriifurmanets.com/blogs',
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
                id="blog-list-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <h1 className="text-4xl font-bold mb-8">Blog</h1>

            {/* Tags filter - Replace the old implementation with our new component */}
            <div className="relative">
                <TagsFilter tags={allTags} baseUrl="/blogs/tag" />
            </div>

            {/* Blog posts grid */}
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
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {post.tags[0]}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {post.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                                        >
                                            {tag}
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

            {posts.length === 0 && (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Check back later for new content!
                    </p>
                </div>
            )}
        </div>
    );
} 