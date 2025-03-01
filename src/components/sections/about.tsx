'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About Me
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Senior Full-Stack Developer | Fintech & Web3 Specialist
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-lg dark:prose-invert mx-auto max-w-4xl"
        >
          <p className="lead">
            I am a <strong>Senior Full-Stack Developer</strong> with expertise in{' '}
            <strong>React, TypeScript, and Next.js</strong> for frontend development and{' '}
            <strong>Ruby on Rails</strong> for backend solutions. Over the years, I have built{' '}
            <strong>scalable, high-performance applications</strong> across{' '}
            <strong>fintech, Web3, and healthcare industries</strong>, delivering user-centric
            frontend experiences alongside robust backend architectures.
          </p>

          <p>
            I specialize in <strong>building, optimizing, and scaling</strong> applications that
            combine <strong>technical precision with business impact</strong>, ensuring seamless
            user experiences while maintaining high security and performance standards.
          </p>

          <h3 className="text-2xl font-bold mt-8">What I Bring to the Tech Industry</h3>

          <div className="bg-secondary/30 p-6 rounded-lg my-6">
            <h4 className="text-xl font-bold">🚀 A Versatile and Well-Rounded Engineer</h4>
            <p>
              I thrive at the intersection of <strong>frontend and backend development</strong>,
              allowing me to <strong>architect complete solutions</strong>—from{' '}
              <strong>intuitive user interfaces</strong> to{' '}
              <strong>highly optimized backend APIs</strong>. My work spans multiple domains,
              including:
            </p>
            <ul>
              <li>
                <strong>Fintech</strong> – Creating <strong>secure financial platforms</strong> that
                streamline transactions and data flow.
              </li>
              <li>
                <strong>Web3 & Blockchain</strong> – Developing{' '}
                <strong>decentralized applications (dApps)</strong> that redefine digital ownership
                and governance.
              </li>
              <li>
                <strong>Healthcare</strong> – Building <strong>data-driven applications</strong>{' '}
                that enhance medical workflows.
              </li>
            </ul>

            <p className="font-medium mt-4">What sets me apart:</p>
            <ul>
              <li>
                I understand how the <strong>entire software stack</strong> fits together.
              </li>
              <li>
                I bridge the gap between <strong>scalability, security, and performance</strong>.
              </li>
              <li>
                I can step into <strong>any stage of development</strong>, from prototyping to
                production optimization.
              </li>
            </ul>
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg my-6">
            <h4 className="text-xl font-bold">⚡ Problem-Solver, Not Just a Coder</h4>
            <p>
              I don't just write code—I{' '}
              <strong>solve complex technical and business challenges</strong>. Whether it's{' '}
              <strong>
                reducing friction in financial transactions, integrating decentralized systems, or
                scaling high-traffic platforms
              </strong>
              , I focus on delivering solutions that make a measurable impact.
            </p>

            <ul className="mt-4">
              <li>
                <strong>Built and launched</strong> a <strong>career management advisory UI</strong>{' '}
                for a fintech startup, which helped executives proactively manage their
                careers—earning <strong>90%+ positive user feedback</strong>.
              </li>
              <li>
                <strong>Optimized fintech trading platforms</strong>, reducing latency and improving
                real-time transaction accuracy.
              </li>
              <li>
                <strong>Led Web3 integration efforts</strong> on blockchain-based platforms,
                ensuring high security and seamless UX.
              </li>
            </ul>

            <p className="font-medium mt-4">How I think:</p>
            <ul>
              <li>"Does this solution scale?"</li>
              <li>"How does it impact user experience?"</li>
              <li>"Can it be optimized for better performance?"</li>
            </ul>
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg my-6">
            <h4 className="text-xl font-bold">👨‍💻 A Technical Leader with a Growth Mindset</h4>
            <p>
              As a senior developer, I don't just build—I help{' '}
              <strong>teams and projects move in the right direction</strong>. I've had the
              opportunity to{' '}
              <strong>
                guide frontend teams, shape technical roadmaps, and mentor junior engineers
              </strong>{' '}
              to ensure best practices and maintainable architectures.
            </p>

            <ul className="mt-4">
              <li>
                I <strong>lead by example</strong>, making sure every technical decision adds
                long-term value.
              </li>
              <li>
                I've <strong>mentored frontend engineers</strong>, helping them improve{' '}
                <strong>React, TypeScript, and system design skills</strong>.
              </li>
              <li>
                I ensure codebases remain <strong>scalable, maintainable, and performant</strong>
                —even as applications grow in complexity.
              </li>
            </ul>

            <p className="font-medium mt-4">My leadership philosophy:</p>
            <ul>
              <li>
                Write <strong>clean, maintainable code</strong> that stands the test of time.
              </li>
              <li>
                Guide teams toward <strong>efficient, scalable architectures</strong>.
              </li>
              <li>
                Encourage continuous learning, <strong>staying ahead of industry trends</strong>.
              </li>
            </ul>
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg my-6">
            <h4 className="text-xl font-bold">
              🎯 A Developer Who Understands Business & Product Needs
            </h4>
            <p>
              I believe that <strong>great engineering goes beyond just code</strong>—it's about
              understanding the <strong>business context and user experience</strong>. I work
              closely with <strong>product managers, designers, and stakeholders</strong> to align
              technical decisions with business goals.
            </p>

            <ul className="mt-4">
              <li>
                In <strong>fintech</strong>, I build platforms that{' '}
                <strong>prioritize security, compliance, and transaction efficiency</strong>.
              </li>
              <li>
                In <strong>Web3</strong>, I balance{' '}
                <strong>decentralization with usability and performance</strong>.
              </li>
              <li>
                In <strong>startups</strong>, I work directly with founders to{' '}
                <strong>turn ideas into scalable products</strong>.
              </li>
            </ul>

            <p className="font-medium mt-4">
              I don't just ask "How do we build this?"—I ask "How do we build this the right way?"
            </p>
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg my-6">
            <h4 className="text-xl font-bold">📚 A Lifelong Learner and Innovator</h4>
            <p>
              Technology evolves fast, and I make it a priority to{' '}
              <strong>stay ahead of the curve</strong>. I am constantly exploring new technologies
              like <strong>Rust, AI-driven development, and advanced cloud infrastructures</strong>,
              ensuring that the solutions I build today are{' '}
              <strong>future-proof and scalable</strong>.
            </p>

            <ul className="mt-4">
              <li>
                I actively follow emerging trends in <strong>Web3, AI, and cloud computing</strong>.
              </li>
              <li>
                I contribute to <strong>open-source projects</strong> and technical discussions.
              </li>
              <li>
                I continuously <strong>refine and optimize development processes</strong> to
                increase efficiency.
              </li>
            </ul>

            <p className="font-medium mt-4">
              For me, software engineering is not just a job—it's a continuous pursuit of innovation
              and improvement.
            </p>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold">Let's Connect!</h3>
            <p className="mt-4">
              I am always open to discussing{' '}
              <strong>
                exciting projects, technical challenges, and opportunities for collaboration
              </strong>
              . Whether it's a new fintech solution, a blockchain-based application, or an
              innovative startup idea, I bring a{' '}
              <strong>problem-solving mindset and deep technical expertise</strong> to the table.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Link
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Let's build something amazing together!
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
