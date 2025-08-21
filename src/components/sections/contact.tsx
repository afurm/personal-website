'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { trackBusiness } from '@/lib/analytics';
import { haptics } from '@/lib/haptics';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track contact form view
  useEffect(() => {
    trackBusiness.contactFormView();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      haptics.success();
      trackBusiness.contactFormSubmit();
      reset();
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      haptics.error();
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="spacing-section">
      <div className="container spacing-container">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? {} : { duration: 0.5 }}
          className="flex flex-col items-center justify-center spacing-gap text-center spacing-heading"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient-glass">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Have a project in mind or want to discuss potential opportunities? Feel free to reach
              out.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl spacing-gap md:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? {} : { duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <p className="mt-2 text-muted-foreground">
                Feel free to reach out through any of these channels.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 shrink-0 text-muted-foreground"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:furmanets.andriy@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    furmanets.andriy@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 shrink-0 text-muted-foreground"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium">LinkedIn</p>
                  <a
                    href="https://linkedin.com/in/andrii-furmanets-1a5b6452/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    linkedin.com/in/andrii-furmanets-1a5b6452/
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 shrink-0 text-muted-foreground"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium">GitHub</p>
                  <a
                    href="https://github.com/afurm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    github.com/afurm
                  </a>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <h4 className="font-medium">Location</h4>
              <p className="mt-1 text-sm text-muted-foreground">Lviv, Ukraine</p>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? {} : { duration: 0.5 }}
            className="space-y-4"
          >
            {isSubmitted ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 300, damping: 30 }}
                className="glass-card relative rounded-2xl p-8 text-center shadow-glass-lg overflow-hidden"
              >
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-blue/10 animate-pulse" />
                
                {/* Success Icon with Animation */}
                <motion.div
                  initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={shouldReduceMotion ? {} : { delay: 0.2, type: "spring", stiffness: 400, damping: 10 }}
                  className="relative z-10 mx-auto w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4"
                >
                  <motion.svg
                    initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={shouldReduceMotion ? {} : { delay: 0.5, duration: 0.5 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-white dark:text-black"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </motion.div>

                <motion.h3 
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? {} : { delay: 0.3 }}
                  className="relative z-10 text-2xl font-bold text-primary mb-2"
                >
                  Message Sent Successfully!
                </motion.h3>
                
                <motion.p 
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? {} : { delay: 0.4 }}
                  className="relative z-10 text-muted-foreground mb-6"
                >
                  Thank you for reaching out! I'll get back to you within 24 hours.
                </motion.p>
                
                <motion.button
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? {} : { delay: 0.5 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onClick={() => {
                    haptics.light();
                    setIsSubmitted(false);
                    reset();
                  }}
                  className="glass-button relative z-10 inline-flex h-12 items-center justify-center rounded-2xl bg-black dark:bg-white px-8 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field with Floating Label */}
                <div className="relative group">
                  <input
                    id="name"
                    {...register('name')}
                    className="peer w-full h-14 px-4 pt-6 pb-2 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 rounded-2xl"
                    placeholder="Your name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                  >
                    Full Name
                  </label>
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: errors.name ? 1 : 0, y: errors.name ? 0 : -10 }}
                    className="mt-2 flex items-center gap-1 text-xs text-destructive"
                  >
                    {errors.name && (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name.message}
                      </>
                    )}
                  </motion.div>
                </div>
                {/* Email Field with Floating Label */}
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="peer w-full h-14 px-4 pt-6 pb-2 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 rounded-2xl"
                    placeholder="Your email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                  >
                    Email Address
                  </label>
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: errors.email ? 1 : 0, y: errors.email ? 0 : -10 }}
                    className="mt-2 flex items-center gap-1 text-xs text-destructive"
                  >
                    {errors.email && (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </>
                    )}
                  </motion.div>
                </div>
                {/* Message Field with Floating Label */}
                <div className="relative group">
                  <textarea
                    id="message"
                    {...register('message')}
                    className="peer w-full min-h-[140px] px-4 pt-8 pb-4 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 resize-none rounded-2xl"
                    placeholder="Your message"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                  >
                    Your Message
                  </label>
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: errors.message ? 1 : 0, y: errors.message ? 0 : -10 }}
                    className="mt-2 flex items-center gap-1 text-xs text-destructive"
                  >
                    {errors.message && (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.message.message}
                      </>
                    )}
                  </motion.div>
                </div>
                {/* Error Message */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                  animate={{ opacity: error ? 1 : 0, y: error ? 0 : -10 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  {error && (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </>
                  )}
                </motion.div>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="glass-button group relative inline-flex h-14 w-full items-center justify-center rounded-2xl bg-black dark:bg-white px-8 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
