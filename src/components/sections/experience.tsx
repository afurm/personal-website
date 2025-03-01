'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaChartLine,
  FaLaptopCode,
  FaServer,
  FaChartBar,
  FaChild,
  FaBaby,
} from 'react-icons/fa';

const experiences = [
  {
    company: 'NEAR Protocol',
    role: 'Senior Software Engineer',
    period: '2021 - Present',
    description:
      'Working on blockchain and Web3 technologies, contributing to the development of decentralized applications and infrastructure.',
    icon: <FaCode className="text-[#00C1DE] text-3xl" />,
    side: 'left',
  },
  {
    company: 'Chime',
    role: 'Senior Software Engineer',
    period: '2019 - 2021',
    description:
      'Built and launched a career management advisory UI for a fintech startup, enabling executives to manage career paths more proactively—received 90%+ positive user feedback.',
    icon: <FaChartLine className="text-green-500 text-3xl" />,
    side: 'right',
  },
  {
    company: 'Intellias',
    role: 'Frontend Developer',
    period: '2017 - 2019',
    description:
      'Led technical decision-making in multiple projects, ensuring scalable, maintainable, and high-performance architecture for banking and finance applications.',
    icon: <FaLaptopCode className="text-blue-500 text-3xl" />,
    side: 'left',
  },
  {
    company: 'Became a Father',
    role: "Life's Greatest Achievement",
    period: 'December 15, 2017',
    description:
      'Welcomed my child into the world and began the most rewarding journey of my life.',
    icon: <FaBaby className="text-pink-500 text-3xl" />,
    side: 'right',
    highlight: true,
  },
  {
    company: 'CyberCraft',
    role: 'Full-Stack Developer',
    period: '2015 - 2017',
    description:
      'Developed full-stack solutions for startups and career management platforms, focusing on responsive design and user experience.',
    icon: <FaServer className="text-purple-500 text-3xl" />,
    side: 'left',
  },
  {
    company: 'SoftServe',
    role: 'Backend Developer',
    period: 'Dec 2012 - Jan 2015',
    description:
      'Crafted a Ruby DSL for healthcare report rendering, turning raw data into actionable charts and tables. Tech: Ruby, Rails, RSpec, Cucumber',
    icon: <FaChartBar className="text-red-500 text-3xl" />,
    side: 'right',
  },
];

const achievements = [
  {
    title: 'Developed & Launched a Fintech Career Management Platform',
    details: [
      'Designed and implemented a career advisory UI for a fintech startup, empowering executives to proactively manage their career paths.',
      'Achieved 90%+ positive user feedback for usability, efficiency, and strategic value.',
    ],
  },
  {
    title: 'Led High-Impact Technical Decision-Making',
    details: [
      'Spearheaded frontend and backend architecture decisions to ensure scalability, maintainability, and high performance across multiple projects.',
      'Optimized application performance, reducing load times and improving system efficiency.',
    ],
  },
  {
    title: 'Contributed to Web3 & Blockchain Innovations',
    details: [
      'Developed decentralized applications (dApps) by integrating blockchain solutions into fintech platforms.',
      'Implemented secure and efficient smart contract interactions, enhancing trustless financial operations.',
    ],
  },
  {
    title: 'Built Secure & Data-Driven Healthcare Solutions',
    details: [
      'Engineered high-security healthcare platforms that enhanced data integrity and patient-provider interactions.',
      'Focused on scalable data processing and compliance, ensuring regulatory adherence in sensitive environments.',
    ],
  },
  {
    title: 'Guided & Mentored Frontend Teams',
    details: [
      'Led and mentored frontend engineers, instilling best practices in React, TypeScript, system design, and clean architecture.',
      'Provided technical leadership that improved code quality, performance, and team efficiency.',
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Career Timeline
          </h2>
        </motion.div>

        <div className="relative">
          {/* Center line for desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

          {/* Left line for mobile */}
          <div className="md:hidden absolute left-6 top-0 h-full w-0.5 bg-border"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: exp.side === 'left' ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative mb-16 ${exp.side === 'left' ? 'md:justify-start' : 'md:justify-end'} md:flex items-center`}
            >
              {/* Mobile layout with left-aligned icons */}
              <div className="md:hidden flex flex-row items-start">
                {/* Left-aligned icon for mobile */}
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${exp.highlight ? 'bg-pink-100 border-pink-300 dark:bg-pink-950 dark:border-pink-800' : 'bg-card border-border'} border shadow-sm z-10`}
                  >
                    {exp.icon}
                  </div>
                </div>

                {/* Content for mobile */}
                <div className="flex-1 ml-6">
                  <div
                    className={`rounded-lg border ${exp.highlight ? 'border-pink-300 bg-pink-50 dark:bg-pink-950/20 dark:border-pink-800' : 'border-border bg-card'} p-6 shadow-sm ${exp.highlight ? 'ring-2 ring-pink-300 dark:ring-pink-800' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`text-xl font-bold ${exp.highlight ? 'text-pink-600 dark:text-pink-400' : ''}`}
                      >
                        {exp.company}
                      </h3>
                      <span className="text-sm text-muted-foreground">{exp.period}</span>
                    </div>
                    <p className="text-muted-foreground mb-2">{exp.role}</p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                </div>
              </div>

              {/* Desktop layout (unchanged) */}
              <div
                className={`hidden md:block w-full md:w-5/12 ${exp.side === 'right' && 'md:order-1'}`}
              >
                <div
                  className={`rounded-lg border ${exp.highlight ? 'border-pink-300 bg-pink-50 dark:bg-pink-950/20 dark:border-pink-800' : 'border-border bg-card'} p-6 shadow-sm ${exp.highlight ? 'ring-2 ring-pink-300 dark:ring-pink-800' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={`text-xl font-bold ${exp.highlight ? 'text-pink-600 dark:text-pink-400' : ''}`}
                    >
                      {exp.company}
                    </h3>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground mb-2">{exp.role}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              </div>

              {/* Desktop icon - hidden on mobile, visible on md and up */}
              <div
                className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full ${exp.highlight ? 'bg-pink-100 border-pink-300 dark:bg-pink-950 dark:border-pink-800' : 'bg-card border-border'} border shadow-sm z-10`}
              >
                {exp.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
