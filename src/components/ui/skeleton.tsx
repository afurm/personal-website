'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  shimmer?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'default', 
  width, 
  height,
  shimmer = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 animate-pulse';
  
  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const style = {
    width,
    height
  };

  if (shimmer) {
    return (
      <div 
        className={`relative overflow-hidden ${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Predefined skeleton components for common layouts
export function CardSkeleton() {
  return (
    <div className="card-hover-effect rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <Skeleton height={24} className="w-3/4" />
        <div className="space-y-2">
          <Skeleton height={16} className="w-full" />
          <Skeleton height={16} className="w-5/6" />
          <Skeleton height={16} className="w-4/6" />
        </div>
        <div className="flex gap-2">
          <Skeleton height={24} width={60} className="rounded-full" />
          <Skeleton height={24} width={80} className="rounded-full" />
          <Skeleton height={24} width={70} className="rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TechIconSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton height={12} width={60} />
    </div>
  );
}

export function TimelineCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton height={24} className="w-2/3" />
          <Skeleton height={16} width={80} />
        </div>
        <Skeleton height={16} className="w-1/2" />
        <div className="space-y-2">
          <Skeleton height={14} className="w-full" />
          <Skeleton height={14} className="w-4/5" />
          <Skeleton height={14} className="w-3/4" />
        </div>
      </div>
    </div>
  );
}