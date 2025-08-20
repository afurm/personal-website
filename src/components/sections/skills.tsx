'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    category: 'Frontend Technologies',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Material UI',
      'Redux',
      'React Query',
    ],
  },
  {
    category: 'Backend Technologies',
    skills: [
      'Ruby on Rails',
      'Node.js',
      'Express',
      'GraphQL',
      'REST API',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Sidekiq',
    ],
  },
  {
    category: 'Web3 & Blockchain',
    skills: ['NEAR Protocol', 'Solidity', 'Web3.js', 'Ethers.js', 'Smart Contracts', 'DApps'],
  },
  {
    category: 'DevOps & Deployment',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GitHub Actions', 'Vercel', 'Heroku'],
  },
  {
    category: 'Security & Authentication',
    skills: ['OAuth', 'JWT', 'Firebase Auth', 'Role-Based Access Control', 'Data Encryption'],
  },
  {
    category: 'Testing & Debugging',
    skills: ['Jest', 'React Testing Library', 'Cypress', 'RSpec', 'Debugging Tools'],
  },
];

export function Skills() {
  return (
    <section id="skills" className="spacing-section bg-secondary/30">
      <div className="container spacing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center spacing-gap text-center spacing-heading"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient-hover">
              Skills & Expertise
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A comprehensive overview of my technical skills and areas of expertise.
            </p>
          </div>
        </motion.div>

        <div className="grid spacing-gap md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((skillCategory, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              className="card-hover-effect card-gradient-border card-3d-tilt rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">{skillCategory.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillCategory.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: skillIndex * 0.05 + categoryIndex * 0.1 }}
                    className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-sm font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center text-muted-foreground"
        >
          Additionally, I have expertise in performance optimization, scalability, and mentoring
          junior developers.
        </motion.p>
      </div>
    </section>
  );
}
