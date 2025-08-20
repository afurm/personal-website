'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TechIcon } from '../ui/tech-icon';

const techStack = [
  { name: 'React', icon: '/icons/react.svg' },
  { name: 'Next.js', icon: '/icons/nextjs.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Tailwind CSS', icon: '/icons/tailwind.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'Ruby on Rails', icon: '/icons/rails.svg' },
  { name: 'GraphQL', icon: '/icons/graphql.svg' },
  { name: 'MongoDB', icon: '/icons/mongodb.svg' },
  { name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
  { name: 'Redux', icon: '/icons/redux.svg' },
  { name: 'Docker', icon: '/icons/docker.svg' },
  { name: 'AWS', icon: '/icons/aws.svg' },
];

export function Hero() {
  return (
    <section className="spacing-section relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-bl from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-purple-500/30 to-indigo-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ x: -100, y: 100, rotate: 0 }}
          animate={{ x: 100, y: -100, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
        />
        <motion.div
          initial={{ x: 100, y: -50, rotate: 0 }}
          animate={{ x: -50, y: 100, rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-3/4 right-1/3 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 transform rotate-45 opacity-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: 80, y: -60, rotate: 180 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-3 h-3 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full opacity-25"
        />
        <motion.div
          initial={{ x: 50, y: -80, rotate: 0 }}
          animate={{ x: -100, y: 50, rotate: 270 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/2 w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 opacity-15"
        />
      </div>
      <div className="container spacing-container relative z-10">
        <div className="grid spacing-gap-lg lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center spacing-gap"
          >
            <div className="spacing-gap-sm flex flex-col">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Andrii Furmanets
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground/90">
                Full-Stack Developer | React, TypeScript, Next.js | Ruby on Rails
              </p>
            </div>
            <p className="max-w-[600px] text-base sm:text-lg lg:text-xl text-muted-foreground/80 leading-relaxed">
              A highly skilled Senior Full-Stack Developer with expertise in React, TypeScript, and
              Next.js for frontend and Ruby on Rails for backend solutions. Adept at crafting
              high-performance applications for fintech, Web3, and healthcare industries, delivering
              scalable and user-friendly solutions.
            </p>
            <div className="flex flex-col spacing-gap sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="#contact"
                  className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto overflow-hidden"
                >
                  <span className="relative z-10">Start a Project</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/Andrii Furmanets Full-Stack React_Ruby on Rails.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center justify-center rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm px-8 text-sm font-semibold transition-all duration-200 hover:bg-background hover:shadow-lg hover:border-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
                >
                  <span className="mr-2">Download Resume</span>
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="relative h-10 w-10">
                    <TechIcon name={tech.name} icon={tech.icon} />
                  </div>
                  <div className="text-center text-xs font-medium">{tech.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
