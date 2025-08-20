import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines CSS classes using clsx and tailwind-merge
 * @param inputs Class values to combine
 * @returns Combined and deduplicated CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date string into a more readable format
 * @param dateString The date string to format (e.g., "2023-01-01")
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Format options
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
}

/**
 * Truncate a string to a specified length and add ellipsis
 * @param str The string to truncate
 * @param length The maximum length of the string
 * @returns Truncated string with ellipsis
 */
export function truncateString(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

/**
 * Generate a slug from a string
 * @param str The string to generate a slug from
 * @returns A URL-friendly slug
 */
export function generateSlug(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
        .trim();
} 