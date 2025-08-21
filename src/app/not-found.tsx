import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Andrii Furmanets',
  description: 'The page you are looking for does not exist. Browse my portfolio, blog posts, or contact me for your next project.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Browse Blog
            </Link>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Looking for something specific?
            </p>
            <div className="space-y-1 text-sm">
              <Link href="/about" className="block text-primary hover:underline">
                About Me
              </Link>
              <Link href="/#contact" className="block text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}