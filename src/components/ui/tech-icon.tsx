"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface TechIconProps {
    name: string;
    icon: string;
}

// List of icons that should always remain colorful
const colorfulIcons = ["Next.js", "Ruby on Rails", "Node.js", "MongoDB", "PostgreSQL"];

export function TechIcon({ name, icon }: TechIconProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Check if this icon should remain colorful
    const shouldRemainColorful = colorfulIcons.includes(name);

    // During server rendering or before mounting, use a default class
    // After mounting, apply the theme-specific class
    const iconClass = mounted
        ? `object-contain ${theme === "dark" && !shouldRemainColorful ? "invert" : ""}`
        : "object-contain"; // Default class for server-side rendering

    return (
        <div className="relative h-10 w-10">
            <Image
                src={icon}
                alt={name}
                fill
                className={iconClass}
            />
        </div>
    );
} 