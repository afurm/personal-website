'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-destructive/20">500</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            An unexpected error occurred. Don't worry, it's not your fault. Please try again or contact me if the problem persists.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Go Home
            </Link>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Need help?
            </p>
            <Link href="/#contact" className="text-sm text-primary hover:underline">
              Contact me directly
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}