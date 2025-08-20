'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { formatDate } from '../../lib/utils';
import { ShareButton } from '../ui/share-button';
import { trackBusiness } from '@/lib/analytics';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    content: string;
}

interface RelatedPost {
    slug: string;
    title: string;
    excerpt: string;
}

interface BlogPostClientProps {
    post: BlogPost;
    readingTime: number;
    relatedPosts: RelatedPost[];
    canonicalUrl: string;
}

export function BlogPostClient({ post, readingTime, relatedPosts, canonicalUrl }: BlogPostClientProps) {
    // Track blog post view
    useEffect(() => {
        trackBusiness.blogPostView(post.title);
    }, [post.title]);

    return (
        <div className="container mx-auto px-4 pt-4 md:pt-24 pb-12">
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
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-4xl font-bold flex-1">{post.title}</h1>
                        
                        {/* Desktop Share Button */}
                        <div className="hidden sm:block">
                            <ShareButton 
                                title={post.title}
                                text={post.description}
                                url={canonicalUrl}
                                variant="button"
                            />
                        </div>
                    </div>

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

                        {/* Mobile Share Button - inline with meta */}
                        <div className="sm:hidden">
                            <ShareButton 
                                title={post.title}
                                text={post.description}
                                url={canonicalUrl}
                                variant="icon"
                            />
                        </div>
                    </div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Share section after content */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Share this article</h3>
                        <ShareButton 
                            title={post.title}
                            text={`Check out this article: ${post.description}`}
                            url={canonicalUrl}
                            variant="button"
                        />
                    </div>
                </div>

                {/* Tags section */}
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
                                <div key={relatedPost.slug} className="group">
                                    <Link
                                        href={`/blogs/${relatedPost.slug}`}
                                        className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1">
                                                {relatedPost.title}
                                            </h3>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShareButton 
                                                    title={relatedPost.title}
                                                    text={relatedPost.excerpt}
                                                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blogs/${relatedPost.slug}`}
                                                    variant="icon"
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {relatedPost.excerpt}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Floating Mobile Share Button */}
            <div className="fixed bottom-20 right-4 sm:hidden">
                <ShareButton 
                    title={post.title}
                    text={post.description}
                    url={canonicalUrl}
                    variant="button"
                />
            </div>
        </div>
    );
}
