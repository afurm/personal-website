'use client';

import Link from 'next/link';
import { formatDate } from '../../lib/utils';
import TagsFilter from '../ui/TagsFilter';
import { PullToRefresh } from '../ui/pull-to-refresh';
import { useState, useCallback } from 'react';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
}

interface BlogsPageClientProps {
    initialPosts: BlogPost[];
    allTags: string[];
}

export function BlogsPageClient({ initialPosts, allTags }: BlogsPageClientProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            // In a real app, you'd fetch fresh data here
            // For now, we'll just simulate a refresh
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate getting fresh data (in reality, you'd call your API)
            setPosts([...initialPosts]);
        } catch (error) {
            console.error('Failed to refresh posts:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [initialPosts]);

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl font-bold mb-8">Blog</h1>

                {/* Tags filter */}
                <div className="relative mb-8">
                    <TagsFilter tags={allTags} baseUrl="/blogs/tag" />
                </div>

                {/* Loading indicator */}
                {isRefreshing && (
                    <div className="text-center py-4 mb-4">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Refreshing posts...
                        </div>
                    </div>
                )}

                {/* Blog posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article
                            key={post.slug}
                            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <Link href={`/blogs/${post.slug}`}>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={post.date}>
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
        </PullToRefresh>
    );
}
