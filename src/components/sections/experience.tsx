'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FaCode,
  FaChartLine,
  FaLaptopCode,
  FaServer,
  FaChartBar,
  FaChild,
  FaBaby,
  FaAward,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';

type Experience = {
  company: string;
  role: string;
  period: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  side: 'left' | 'right';
  highlight?: boolean;
  achievements?: string[];
  technologies?: string[];
  impact?: string;
  links?: Array<{ label: string; href: string }>;
};

const experiences: Experience[] = [
  {
    company: 'FolioFlux',
    role: 'Founder',
    period: 'Sep 2024 - Present',
    description: 'Designed and developed FolioFlux, an AI-powered crypto portfolio tracking platform. Built the entire application from concept to implementation as the sole developer. Created the UI/UX design, front-end and back-end architecture. Implemented AI-driven analytics features for portfolio optimization. Developed real-time data integration with cryptocurrency exchanges and market data providers.',
    icon: <FaCode className="text-[#00C1DE] text-3xl" />,
    side: 'left',
    highlight: true,
    achievements: ['Launched MVP in 3 months', '500+ active users', 'AI-powered analytics'],
    technologies: ['Next.js', 'TypeScript', 'AI/ML', 'Real-time APIs'],
    impact: 'Revolutionizing crypto portfolio management with intelligent insights',
    links: [
      { label: '🌐 Website', href: 'https://www.folioflux.com/' },
      { label: '💻 GitHub', href: 'https://github.com/afurm/porfolio-traker' },
      { label: '🔗 LinkedIn', href: 'https://www.linkedin.com/company/folioflux' },
    ],
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
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section id="experience" className="spacing-section bg-background">
      <div className="container spacing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="spacing-heading"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-gradient-glass">
            Career Timeline
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated timeline line for desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border/30"></div>
          <motion.div 
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-accent-blue origin-top"
            style={{ 
              scaleY: timelineProgress,
              height: '100%'
            }}
          />

          {/* Animated timeline line for mobile */}
          <div className="md:hidden absolute left-6 top-0 h-full w-0.5 bg-border/30"></div>
          <motion.div 
            className="md:hidden absolute left-6 top-0 w-0.5 bg-accent-blue origin-top"
            style={{ 
              scaleY: timelineProgress,
              height: '100%'
            }}
          />

          {experiences.map((exp, index) => {
            const isExpanded = expandedCard === index;
            
            return (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: exp.side === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                className={`relative mb-16 ${exp.side === 'left' ? 'md:justify-start' : 'md:justify-end'} md:flex items-center`}
              >
              {/* Mobile layout with left-aligned icons */}
              <div className="md:hidden flex flex-row items-start">
                {/* Left-aligned icon for mobile */}
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${exp.highlight ? 'glass-light border-accent-blue/30' : 'glass'} border shadow-glass z-10`}
                  >
                    {exp.icon}
                  </div>
                </div>

                {/* Content for mobile */}
                <div className="flex-1 ml-6">
                  <motion.div
                    className={`glass-card rounded-2xl cursor-pointer transition-all duration-300 ${
                      exp.highlight 
                        ? 'glass-light shadow-glass-lg' 
                        : 'glass hover:glass-light'
                    } p-6 ${
                      isExpanded ? 'ring-2 ring-accent-blue/30' : ''
                    }`}
                    onClick={() => setExpandedCard(isExpanded ? null : index)}
                    whileHover={{ y: -2 }}
                    layout
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold ${exp.highlight ? 'text-accent-blue' : ''}`}>
                        {exp.company}
                      </h3>
                      <div className="flex items-center gap-2">
                        {exp.highlight && <FaTrophy className="text-yellow-500" />}
                        <span className="text-sm text-muted-foreground">{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{exp.role}</p>
                    <p className="text-sm mb-4">{exp.description}</p>
                    
                    {/* Expandable content */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {exp.achievements && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <FaAward className="text-accent-blue" /> Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="text-xs flex items-center gap-2">
                                <FaStar className="text-yellow-400 text-[8px]" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {exp.technologies && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm mb-2">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech, i) => (
                              <span key={i} className="text-xs glass text-accent-blue px-2 py-1 rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {exp.links && (
                        <div className="flex flex-wrap gap-2">
                          {exp.links.map((link, i) => (
                            <a
                              key={i}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="glass-button inline-flex items-center px-3 py-1 rounded-full text-accent-blue hover:glass-light transition-all duration-200 text-xs"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Desktop layout (unchanged) */}
              <div
                className={`hidden md:block w-full md:w-5/12 ${exp.side === 'right' && 'md:order-1'}`}
              >
                <div
                  className={`glass-card rounded-2xl ${exp.highlight ? 'glass-light shadow-glass-lg' : 'glass'} p-6 ${exp.highlight ? 'ring-2 ring-accent-blue/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={`text-xl font-bold ${exp.highlight ? 'text-accent-blue' : ''}`}
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
                className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full ${exp.highlight ? 'glass-light border-accent-blue/30' : 'glass'} border shadow-glass z-10`}
              >
                {exp.icon}
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
