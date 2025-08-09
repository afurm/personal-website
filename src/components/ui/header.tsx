'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  // Function to get the correct link path
  const getNavLink = (section: string) => {
    return isHomePage ? `#${section}` : `/#${section}`;
  };

  // useEffect for mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="glass sticky top-0 z-40 w-full border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="font-bold text-xl">
              Andrii Furmanets
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href={getNavLink('about')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link
                href={getNavLink('experience')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Experience
              </Link>
              <Link
                href={getNavLink('skills')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Skills
              </Link>
              <Link
                href={getNavLink('education')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Education
              </Link>
              <Link
                href="/blogs"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Blog
              </Link>
              <Link
                href={getNavLink('contact')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle - visible only on desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link
              href={getNavLink('contact')}
              className="hidden md:inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Contact Me
            </Link>
            {/* Hamburger menu button - visible only on mobile */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu - full screen overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-white dark:bg-gray-950 z-[9999] md:hidden flex flex-col"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <span className="font-bold text-lg">Menu</span>
            <button
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col p-4 flex-grow">
            <Link
              href={getNavLink('about')}
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href={getNavLink('experience')}
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              Experience
            </Link>
            <Link
              href={getNavLink('skills')}
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              Skills
            </Link>
            <Link
              href={getNavLink('education')}
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              Education
            </Link>
            <Link
              href="/blogs"
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              Blog
            </Link>
            <Link
              href={getNavLink('contact')}
              className="py-4 text-lg font-medium transition-colors hover:text-primary border-b border-gray-200 dark:border-gray-800 text-center"
              onClick={toggleMenu}
            >
              Contact
            </Link>

            {/* Custom theme toggle in mobile menu */}
            <div className="py-6 flex justify-center items-center border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center gap-3">
                <span className="text-lg font-medium">Theme</span>
                {mounted && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${theme === 'light'
                          ? 'bg-white text-black shadow-sm'
                          : 'text-gray-500 dark:text-gray-400'
                        }`}
                      aria-label="Light mode"
                    >
                      <Sun className="h-4 w-4" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${theme === 'dark'
                          ? 'bg-gray-700 text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400'
                        }`}
                      aria-label="Dark mode"
                    >
                      <Moon className="h-4 w-4" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto pb-8">
              <Link
                href={getNavLink('contact')}
                className="w-full flex items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={toggleMenu}
              >
                Contact Me
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
