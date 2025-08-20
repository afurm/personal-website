'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { trackBusiness } from '@/lib/analytics';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'icon' | 'button';
}

export function ShareButton({ 
  title = 'Andrii Furmanets - Senior Full-Stack Developer',
  text = 'Check out this portfolio!',
  url,
  className = '',
  variant = 'icon'
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleNativeShare = async () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to custom share menu
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyToClipboard,
      color: copied ? 'text-green-600' : 'text-muted-foreground'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
        trackBusiness.blogPostShare(title, 'Twitter');
        setIsOpen(false);
      },
      color: 'text-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank');
        trackBusiness.blogPostShare(title, 'LinkedIn');
        setIsOpen(false);
      },
      color: 'text-blue-600'
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + ' ' + shareUrl)}`;
        window.location.href = mailtoUrl;
        setIsOpen(false);
      },
      color: 'text-muted-foreground'
    }
  ];

  const buttonClass = variant === 'button' 
    ? `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors min-h-[44px] ${className}`
    : `p-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${className}`;

  return (
    <div className="relative">
      <motion.button
        onClick={handleNativeShare}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        className={buttonClass}
        aria-label="Share"
      >
        <Share2 className="w-5 h-5" />
        {variant === 'button' && <span>Share</span>}
      </motion.button>

      {/* Custom share menu fallback */}
      <AnimatePresence>
        {isOpen && !navigator.share && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Share menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: shouldReduceMotion 
                  ? { duration: 0 }
                  : { type: 'spring', damping: 20 }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 10,
                transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
              }}
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-2 z-50 min-w-[200px]"
            >
              <div className="space-y-1">
                {shareOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.name}
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                      animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                      transition={shouldReduceMotion ? {} : { delay: index * 0.05 }}
                      onClick={option.action}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-left min-h-[44px]"
                    >
                      <Icon className={`w-5 h-5 ${option.color}`} />
                      <span className="text-sm font-medium">{option.name}</span>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Arrow pointer */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}