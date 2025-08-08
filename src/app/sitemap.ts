import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '../lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://andriifurmanets.com';

  // Get all blog posts
  const posts = await getAllBlogPosts();
  const blogPostsUrls = posts.map(post => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Exclude tag listing pages from sitemap (thin/duplicative content)

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add blog posts
    ...blogPostsUrls,
  ];
}
