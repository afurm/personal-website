"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface TagsFilterProps {
    tags: string[];
    baseUrl: string;
}

export default function TagsFilter({ tags, baseUrl }: TagsFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Check if we're on mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Filter tags based on search query
    const filteredTags = tags.filter(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle outside click to close expanded view
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if we're on the tag page
    useEffect(() => {
        if (pathname.startsWith('/blogs/tag/')) {
            const currentTag = decodeURIComponent(pathname.split('/').pop() || '');
            setSelectedTags([currentTag]);
        } else {
            setSelectedTags([]);
        }
    }, [pathname]);

    // Handle tag selection/deselection
    const handleTagClick = (tag: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // If the tag is already selected, deselect it and go back to main blog page
        if (selectedTags.includes(tag)) {
            router.push('/blogs');
        } else {
            // Otherwise navigate to the tag page
            router.push(`${baseUrl}/${tag}`);
        }

        // Close the mobile dropdown if open
        if (isExpanded) {
            setIsExpanded(false);
        }
    };

    return (
        <div className="mb-8" ref={containerRef}>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Filter by tags</h2>
                {/* Only show the Show all/Show less button on desktop */}
                {!isMobile && tags.length > 10 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? 'Show less' : 'Show all tags'}
                    </button>
                )}
            </div>

            {/* Mobile view - accordion style */}
            {isMobile && (
                <div className="block md:hidden">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left font-medium"
                        aria-expanded={isExpanded}
                    >
                        <span>
                            {selectedTags.length > 0
                                ? `Selected: ${selectedTags.join(', ')}`
                                : 'Select tags'}
                        </span>
                        <svg
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isExpanded && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="mb-3 relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search tags..."
                                    className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto flex flex-wrap gap-2">
                                {filteredTags.length > 0 ? (
                                    filteredTags.map(tag => (
                                        <a
                                            key={tag}
                                            href={`${baseUrl}/${tag}`}
                                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleTagClick(tag, e)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer flex items-center gap-1 ${selectedTags.includes(tag)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {tag}
                                            {selectedTags.includes(tag) && (
                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No tags found</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Desktop view */}
            <div className={`hidden md:block ${isExpanded ? '' : 'max-h-32 overflow-hidden'}`}>
                <div className="mb-3 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search tags..."
                        className="w-full md:w-64 pl-8 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {filteredTags.length > 0 ? (
                        filteredTags.map(tag => (
                            <a
                                key={tag}
                                href={`${baseUrl}/${tag}`}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleTagClick(tag, e)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer flex items-center gap-1 ${selectedTags.includes(tag)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tag}
                                {selectedTags.includes(tag) && (
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No tags found</p>
                    )}
                </div>
                {!isExpanded && tags.length > 15 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
                )}
            </div>
        </div>
    );
} 