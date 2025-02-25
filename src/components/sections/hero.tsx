"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TechIcon } from "../ui/tech-icon";

const techStack = [
    { name: "React", icon: "/icons/react.svg" },
    { name: "Next.js", icon: "/icons/nextjs.svg" },
    { name: "TypeScript", icon: "/icons/typescript.svg" },
    { name: "Tailwind CSS", icon: "/icons/tailwind.svg" },
    { name: "Node.js", icon: "/icons/nodejs.svg" },
    { name: "Ruby on Rails", icon: "/icons/rails.svg" },
    { name: "GraphQL", icon: "/icons/graphql.svg" },
    { name: "MongoDB", icon: "/icons/mongodb.svg" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    { name: "Redux", icon: "/icons/redux.svg" },
    { name: "Docker", icon: "/icons/docker.svg" },
    { name: "AWS", icon: "/icons/aws.svg" },
];

export function Hero() {
    return (
        <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-center space-y-4"
                    >
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                Andrii Furmanets
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Full-Stack Developer | React, TypeScript, Next.js | Ruby on Rails
                            </p>
                        </div>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            A highly skilled Senior Full-Stack Developer with expertise in React, TypeScript, and Next.js for frontend and Ruby on Rails for backend solutions. Adept at crafting high-performance applications for fintech, Web3, and healthcare industries, delivering scalable and user-friendly solutions.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Link
                                href="#experience"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
                            >
                                View My Experience
                            </Link>
                            <Link
                                href="#contact"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
                            >
                                Contact Me
                            </Link>
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
                                        <TechIcon
                                            name={tech.name}
                                            icon={tech.icon}
                                        />
                                    </div>
                                    <div className="text-center text-xs font-medium">
                                        {tech.name}
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