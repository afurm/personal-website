import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Define the blog directory path
const blogsDirectory = path.join(process.cwd(), 'blogs');

// Define the BlogPost type
export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    content: string;
    excerpt: string;
};

/**
 * Get all blog posts with their metadata
 * @returns Array of blog posts sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    // Get all files from the blogs directory
    const fileNames = fs.readdirSync(blogsDirectory);

    // Get the data from each file
    const allPostsData = await Promise.all(
        fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(async fileName => {
                // Remove ".md" from file name to get slug
                const slug = fileName.replace(/\.md$/, '');

                // Read markdown file as string
                const fullPath = path.join(blogsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');

                // Use gray-matter to parse the post metadata section
                const matterResult = matter(fileContents);

                // Use remark to convert markdown into HTML string
                const processedContent = await remark()
                    .use(html)
                    .process(matterResult.content);
                const contentHtml = processedContent.toString();

                // Create excerpt (first 150 characters of content)
                const excerpt = matterResult.content
                    .replace(/[#\*`]/g, '') // Remove markdown characters
                    .trim()
                    .slice(0, 150) + '...';

                // Combine the data with the slug
                return {
                    slug,
                    title: matterResult.data.title,
                    description: matterResult.data.description,
                    date: matterResult.data.date,
                    tags: matterResult.data.tags || [],
                    content: contentHtml,
                    excerpt,
                };
            })
    );

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

/**
 * Get a single blog post by slug
 * @param slug The slug of the blog post
 * @returns The blog post data
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        // Construct the file path
        const fullPath = path.join(blogsDirectory, `${slug}.md`);

        // Read the file
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse the front matter
        const matterResult = matter(fileContents);

        // Convert markdown to HTML
        const processedContent = await remark()
            .use(html)
            .process(matterResult.content);
        const contentHtml = processedContent.toString();

        // Create excerpt
        const excerpt = matterResult.content
            .replace(/[#\*`]/g, '')
            .trim()
            .slice(0, 150) + '...';

        // Return the blog post data
        return {
            slug,
            title: matterResult.data.title,
            description: matterResult.data.description,
            date: matterResult.data.date,
            tags: matterResult.data.tags || [],
            content: contentHtml,
            excerpt,
        };
    } catch (error) {
        console.error(`Error getting blog post with slug ${slug}:`, error);
        return null;
    }
}

/**
 * Get all unique tags from all blog posts
 * @returns Array of unique tags
 */
export async function getAllTags(): Promise<string[]> {
    const posts = await getAllBlogPosts();
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
}

/**
 * Get all blog posts with a specific tag
 * @param tag The tag to filter by
 * @returns Array of blog posts with the specified tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await getAllBlogPosts();
    return posts.filter(post => post.tags.includes(tag));
}

/**
 * Get related blog posts based on tags
 * @param currentPost The current blog post
 * @param maxPosts Maximum number of related posts to return
 * @returns Array of related blog posts
 */
export async function getRelatedPosts(currentPost: BlogPost, maxPosts: number = 3): Promise<BlogPost[]> {
    const allPosts = await getAllBlogPosts();

    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

    // Calculate relevance score based on shared tags
    const postsWithRelevance = otherPosts.map(post => {
        const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
        return {
            ...post,
            relevance: sharedTags.length,
        };
    });

    // Sort by relevance and return the top N posts
    return postsWithRelevance
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, maxPosts);
}

/**
 * Calculate estimated reading time for a blog post
 * @param content The content of the blog post
 * @returns Estimated reading time in minutes
 */
export function getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
} 