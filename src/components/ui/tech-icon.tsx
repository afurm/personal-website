'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Skeleton } from './skeleton';

interface TechIconProps {
  name: string;
  icon: string;
}

// List of icons that should always remain colorful
const colorfulIcons = ['Next.js', 'Ruby on Rails', 'Node.js', 'MongoDB', 'PostgreSQL'];

export function TechIcon({ name, icon }: TechIconProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this icon should remain colorful
  const shouldRemainColorful = colorfulIcons.includes(name);

  // During server rendering or before mounting, use a default class
  // After mounting, apply the theme-specific class
  const iconClass = mounted
    ? `object-contain transition-opacity duration-300 ${theme === 'dark' && !shouldRemainColorful ? 'invert' : ''} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`
    : 'object-contain opacity-0'; // Default class for server-side rendering

  return (
    <div className="relative h-10 w-10">
      {/* Show skeleton while loading */}
      {!imageLoaded && !imageError && (
        <Skeleton variant="circular" width="100%" height="100%" />
      )}
      
      {/* Show fallback on error */}
      {imageError && (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-blue/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
          {name.charAt(0)}
        </div>
      )}
      
      {/* Actual image */}
      <Image 
        src={icon} 
        alt={name} 
        fill 
        className={iconClass}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
      />
    </div>
  );
}
