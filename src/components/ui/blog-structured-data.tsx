'use client';

import { useEffect } from 'react';
import { BlogPost } from '@/lib/blog';

interface BlogStructuredDataProps {
  post: BlogPost;
  canonicalUrl: string;
  readingTime: number;
}

export function BlogStructuredData({ post, canonicalUrl, readingTime }: BlogStructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: canonicalUrl,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: 'Andrii Furmanets',
        url: 'https://andriifurmanets.com',
        sameAs: [
          'https://github.com/afurm',
          'https://linkedin.com/in/andrii-furmanets-1a5b6452/',
        ],
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
      keywords: post.tags.join(', '),
      articleSection: 'Technology',
      wordCount: post.content.split(/\s+/).length,
      timeRequired: `PT${readingTime}M`,
      inLanguage: 'en-US',
    });
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [post, canonicalUrl, readingTime]);

  return null;
}