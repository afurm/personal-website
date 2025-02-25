"use client";

import { useEffect } from "react";

export function StructuredData() {
    useEffect(() => {
        // Add structured data to the page
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Andrii Furmanets",
            "jobTitle": "Senior Full-Stack Developer",
            "url": "https://andriifurmanets.com",
            "sameAs": [
                "https://github.com/afurm",
                "https://linkedin.com/in/andrii-furmanets-1a5b6452/",
                // Add other social profiles if available
            ],
            "knowsAbout": [
                "React",
                "TypeScript",
                "Next.js",
                "Ruby on Rails",
                "Web3",
                "Fintech",
                "Healthcare Software",
                "JavaScript",
                "Frontend Development",
                "Backend Development"
            ],
            "worksFor": {
                "@type": "Organization",
                "name": "Freelance/Independent"
            }
        });
        document.head.appendChild(script);

        return () => {
            // Clean up
            document.head.removeChild(script);
        };
    }, []);

    return null;
} 