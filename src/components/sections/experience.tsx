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

type Experience = {
  company: string;
  role: string;
  period: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  side: 'left' | 'right';
  highlight?: boolean;
};

const experiences: Experience[] = [
  {
    company: 'FolioFlux',
    role: 'Founder',
    period: 'Sep 2024 - Present',
    description: (
      <>
        Designed and developed FolioFlux, an AI-powered crypto portfolio tracking platform. Built the entire application from concept to implementation as the sole developer. Created the UI/UX design, front-end and back-end architecture. Implemented AI-driven analytics features for portfolio optimization. Developed real-time data integration with cryptocurrency exchanges and market data providers.
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://www.folioflux.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            🌐 Website: folioflux.com
          </a>
          <a
            href="https://github.com/afurm/porfolio-traker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            💻 GitHub: Portfolio Tracker
          </a>
          <a
            href="https://www.linkedin.com/company/folioflux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            🔗 LinkedIn: FolioFlux
          </a>
        </div>
      </>
    ),
    icon: <FaCode className="text-[#00C1DE] text-3xl" />,
    side: 'left',
  },
  {
    company: 'Intellias: Cloud Data Warehouse Implementation',
    role: 'Frontend Developer',
    period: 'Aug 2024 - Present',
    description:
      'Architecture & Setup: Established the project from scratch using an Nx monorepo, ensuring a modular and maintainable codebase. Technologies: Built with React and TypeScript for a robust, high-performance front end and leveraged GraphQL for efficient data querying. Key Contributions: Designed reusable components, optimized build processes, and integrated modern development practices to streamline collaboration and accelerate development.',
    icon: <FaChartLine className="text-green-500 text-3xl" />,
    side: 'right',
  },
  {
    company: 'Near Blockchain',
    role: 'Frontend Developer',
    period: 'Jan 2024 - Aug 2024',
    description:
      'Built slick React components on NEAR\'s Blockchain OS, powering decentralized apps with top-tier security and UX. Led Grassroot DAO pages (near.org/ndcdev.near/widget/daos.App), delivering report/proposal features for real-time governance.',
    icon: <FaLaptopCode className="text-blue-500 text-3xl" />,
    side: 'left',
  },
  {
    company: 'Intellias: Fintech Project',
    role: 'Frontend Developer',
    period: 'Nov 2021 - Dec 2023',
    description:
      'Owned end-to-end development of a Next.js-powered fintech site, driving seamless equity and bond trading for users. Partnered with designers to craft intuitive UI, cutting user onboarding time by 25%. Managed production rollouts, ensuring zero-downtime updates under tight deadlines.',
    icon: <FaServer className="text-purple-500 text-3xl" />,
    side: 'right',
  },
  {
    company: 'Intellias: Fintech Project (Banking Platform)',
    role: 'Frontend Developer',
    period: 'Mar 2021 - Nov 2021',
    description:
      'Revamped trading views for an online banking giant, enhancing real-time financial tools with React and Redux.',
    icon: <FaChartBar className="text-red-500 text-3xl" />,
    side: 'left',
  },
  {
    company: 'CyberCraft: Career Management Startup',
    role: 'Frontend Developer',
    period: 'Aug 2020 - Mar 2021',
    description:
      'Launched UI for a startup shaking up executive career paths, using React and Ant Design—solo Ukrainian on the team!',
    icon: <FaChild className="text-yellow-500 text-3xl" />,
    side: 'right',
  },
  {
    company: 'CyberCraft: Continuous Integration Tool',
    role: 'Full-Stack Developer',
    period: 'Jan 2015 - Aug 2020',
    description:
      'Transformed static pages into dynamic Backbone.js interfaces, slashing test wait times by 10-50x. Redesigned report views with Vue, adding lifecycle steps for real-time build insights. Integrated Okta for SAML auth and user provisioning, leveling up security. Upgraded Rails 3 to 4, keeping the engine humming.',
    icon: <FaCode className="text-indigo-500 text-3xl" />,
    side: 'left',
  },
  {
    company: 'SoftServe: Reports Render Engine',
    role: 'Backend Developer',
    period: 'Dec 2012 - Jan 2015',
    description:
      'Crafted a Ruby DSL for healthcare report rendering, turning raw data into actionable charts and tables.',
    icon: <FaChartBar className="text-orange-500 text-3xl" />,
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
    <section id="experience" className="spacing-section bg-background">
      <div className="container spacing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="spacing-heading"
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
