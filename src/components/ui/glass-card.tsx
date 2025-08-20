'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'medium' | 'dark';
  hover?: boolean;
  shimmer?: boolean;
  floating?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  shimmer = false,
  floating = false
}: GlassCardProps) {
  const baseClasses = cn(
    'relative rounded-2xl transition-all duration-300',
    {
      'glass shadow-glass': variant === 'default',
      'glass-light shadow-glass': variant === 'light',
      'glass-medium shadow-glass': variant === 'medium',
      'glass-dark shadow-glass': variant === 'dark',
      'glass-card': hover,
      'glass-shimmer': shimmer,
      'floating-glass': floating,
    },
    className
  );

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2, scale: 1.01 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <Component className={baseClasses} {...motionProps}>
      {children}
    </Component>
  );
}

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  'aria-label'?: string;
}

export function GlassButton({ 
  children, 
  className,
  onClick,
  disabled,
  type = 'button',
  form,
  'aria-label': ariaLabel,
}: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'glass-button relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
      form={form}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
