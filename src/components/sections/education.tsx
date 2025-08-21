'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const educationItems = [
  {
    degree: "Master's Degree in System Programming",
    institution: 'Lviv Polytechnic National University',
    period: '2008 - 2013',
    description:
      'Specialized in software engineering and system programming, with a focus on algorithm design and optimization.',
  },
];

const certifications = [
  {
    title: 'MongoDB for Developers',
    issuer: 'MongoDB University',
    year: '2018',
  },
  {
    title: 'EFSET Quick English Check (CEFR B1/B2)',
    issuer: 'EF Standard English Test',
    year: '2019',
  },
];

export function Education() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section id="education" className="spacing-section">
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
              Education & Certifications
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              My academic background and professional certifications.
            </p>
          </div>
        </motion.div>

        <div className="grid spacing-gap md:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? {} : { duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">Education</h3>
            <div className="space-y-6">
              {educationItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={shouldReduceMotion ? {} : { duration: 0.3, delay: index * 0.1 }}
                  className="glass-card glass-shimmer rounded-2xl p-6 shadow-glass hover:shadow-glass-lg"
                >
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-bold">{item.degree}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{item.institution}</p>
                      <p className="text-xs text-muted-foreground">{item.period}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? {} : { duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">Certifications</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={shouldReduceMotion ? {} : { duration: 0.3, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-4 shadow-glass hover:shadow-glass-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                    <div className="rounded-full glass px-3 py-1 text-xs font-medium">
                      {cert.year}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
