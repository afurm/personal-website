'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { TechIcon } from '../ui/tech-icon';
import { TypewriterText } from '../ui/typewriter-text';

const techStack = [
  { name: 'React', icon: '/icons/react.svg', proficiency: 95 },
  { name: 'Next.js', icon: '/icons/nextjs.svg', proficiency: 90 },
  { name: 'TypeScript', icon: '/icons/typescript.svg', proficiency: 88 },
  { name: 'Tailwind CSS', icon: '/icons/tailwind.svg', proficiency: 92 },
  { name: 'Node.js', icon: '/icons/nodejs.svg', proficiency: 85 },
  { name: 'Ruby on Rails', icon: '/icons/rails.svg', proficiency: 95 },
  { name: 'GraphQL', icon: '/icons/graphql.svg', proficiency: 80 },
  { name: 'MongoDB', icon: '/icons/mongodb.svg', proficiency: 85 },
  { name: 'PostgreSQL', icon: '/icons/postgresql.svg', proficiency: 88 },
  { name: 'Redux', icon: '/icons/redux.svg', proficiency: 90 },
  { name: 'Docker', icon: '/icons/docker.svg', proficiency: 78 },
  { name: 'AWS', icon: '/icons/aws.svg', proficiency: 82 },
];

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -300]);

  return (
    <section className="spacing-section relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900">
      {/* Subtle glass orbs background with parallax */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: y3 }}>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-gray-200/20 to-gray-400/10 rounded-full filter blur-2xl animate-blob floating-glass"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-bl from-gray-300/15 to-gray-500/10 rounded-full filter blur-2xl animate-blob animation-delay-2000 floating-glass"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-gray-400/10 to-gray-600/15 rounded-full filter blur-2xl animate-blob animation-delay-4000 floating-glass"></div>
      </motion.div>
      
      {/* Minimal floating glass elements with parallax */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: y1 }}>
        <motion.div
          initial={{ x: -100, y: 100, rotate: 0 }}
          animate={{ x: 100, y: -100, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-6 h-6 glass-medium rounded-full opacity-30"
        />
        <motion.div
          initial={{ x: 100, y: -50, rotate: 0 }}
          animate={{ x: -50, y: 100, rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-3/4 right-1/3 w-4 h-4 glass-light transform rotate-45 opacity-25"
        />
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: 80, y: -60, rotate: 180 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-3 h-3 glass rounded-full opacity-35"
        />
        <motion.div
          initial={{ x: 50, y: -80, rotate: 0 }}
          animate={{ x: -100, y: 50, rotate: 270 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/2 w-5 h-5 glass-dark transform rotate-12 opacity-20"
        />
      </motion.div>
      <motion.div className="container spacing-container relative z-10" style={{ y: y2 }}>
        <div className="grid spacing-gap-lg lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center spacing-gap"
          >
            <div className="spacing-gap-sm flex flex-col">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl text-gradient-glass">
                Andrii Furmanets
              </h1>
              <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground">
                <TypewriterText
                  texts={[
                    'Full-Stack Developer',
                    'React & TypeScript Expert',
                    'Next.js Specialist',
                    'Ruby on Rails Developer',
                    'Fintech Solutions Builder',
                    'Web3 Developer'
                  ]}
                  speed={100}
                  deleteSpeed={50}
                  pauseTime={2000}
                />
              </div>
            </div>
            <p className="max-w-[600px] text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
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
                  className="glass-button group relative inline-flex h-12 items-center justify-center rounded-2xl bg-black dark:bg-white px-8 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto overflow-hidden"
                >
                  <span className="relative z-10">Start a Project</span>
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
                  className="glass group inline-flex h-12 items-center justify-center rounded-2xl px-8 text-sm font-semibold transition-all duration-300 hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
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
            <motion.div 
              className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 15,
                    rotateX: 5,
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  className="glass-card glass-shimmer group relative flex flex-col items-center justify-center space-y-2 rounded-2xl p-3 shadow-glass transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="relative h-10 w-10 group-hover:scale-110 transition-transform duration-300">
                    <TechIcon name={tech.name} icon={tech.icon} />
                  </div>
                  <div className="text-center text-xs font-medium relative z-10">{tech.name}</div>
                  
                  {/* Proficiency bar */}
                  <div className="w-full bg-muted/30 rounded-full h-1 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      className="h-1 bg-gradient-to-r from-foreground to-accent-blue rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tech.proficiency}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
