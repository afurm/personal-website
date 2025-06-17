'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { TechIcon } from '../ui/tech-icon';

// Lazy load Framer Motion to reduce initial bundle size
const MotionDiv = React.lazy(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.div }))
);

// Prioritize the first 4 most important tech icons for preloading
const techStack = [
  { name: 'React', icon: '/icons/react.svg', priority: true },
  { name: 'Next.js', icon: '/icons/nextjs.svg', priority: true },
  { name: 'TypeScript', icon: '/icons/typescript.svg', priority: true },
  { name: 'Tailwind CSS', icon: '/icons/tailwind.svg', priority: true },
  { name: 'Node.js', icon: '/icons/nodejs.svg', priority: false },
  { name: 'Ruby on Rails', icon: '/icons/rails.svg', priority: false },
  { name: 'GraphQL', icon: '/icons/graphql.svg', priority: false },
  { name: 'MongoDB', icon: '/icons/mongodb.svg', priority: false },
  { name: 'PostgreSQL', icon: '/icons/postgresql.svg', priority: false },
  { name: 'Redux', icon: '/icons/redux.svg', priority: false },
  { name: 'Docker', icon: '/icons/docker.svg', priority: false },
  { name: 'AWS', icon: '/icons/aws.svg', priority: false },
];

// Fallback component for when Motion is loading
function StaticHeroContent() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Andrii Furmanets
              </h1>
              <p className="text-xl text-muted-foreground">
                Full-Stack Developer | React, TypeScript, Next.js | Ruby on Rails
              </p>
            </div>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              A highly skilled Senior Full-Stack Developer with expertise in React, TypeScript, and
              Next.js for frontend and Ruby on Rails for backend solutions. Adept at crafting
              high-performance applications for fintech, Web3, and healthcare industries, delivering
              scalable and user-friendly solutions.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="#experience"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
              >
                View My Experience
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
              >
                Contact Me
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="relative h-10 w-10">
                    <TechIcon name={tech.name} icon={tech.icon} priority={tech.priority} />
                  </div>
                  <div className="text-center text-xs font-medium">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedHeroContent() {
  return (
    <Suspense fallback={<StaticHeroContent />}>
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Andrii Furmanets
                </h1>
                <p className="text-xl text-muted-foreground">
                  Full-Stack Developer | React, TypeScript, Next.js | Ruby on Rails
                </p>
              </div>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A highly skilled Senior Full-Stack Developer with expertise in React, TypeScript, and
                Next.js for frontend and Ruby on Rails for backend solutions. Adept at crafting
                high-performance applications for fintech, Web3, and healthcare industries, delivering
                scalable and user-friendly solutions.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="#experience"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
                >
                  View My Experience
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
                >
                  Contact Me
                </Link>
              </div>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
                {techStack.map((tech, index) => (
                  <MotionDiv
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm"
                  >
                    <div className="relative h-10 w-10">
                      <TechIcon name={tech.name} icon={tech.icon} priority={tech.priority} />
                    </div>
                    <div className="text-center text-xs font-medium">{tech.name}</div>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>
    </Suspense>
  );
}

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    // Only load animations after initial render to prioritize FCP
    const timer = setTimeout(() => setShouldAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return shouldAnimate ? <AnimatedHeroContent /> : <StaticHeroContent />;
}
