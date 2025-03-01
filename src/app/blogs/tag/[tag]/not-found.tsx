import Link from 'next/link';

export default function TagNotFound() {
    return (
        <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-4xl font-bold mb-6">Tag Not Found</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Sorry, the tag you're looking for doesn't exist or has been removed.
            </p>
            <Link
                href="/blogs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to all blogs
            </Link>
        </div>
    );
} 