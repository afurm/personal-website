"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface TechIconProps {
    name: string;
    icon: string;
}

export function TechIcon({ name, icon }: TechIconProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // During server rendering or before mounting, use a default class
    // After mounting, apply the theme-specific class
    const iconClass = mounted
        ? `object-contain filter ${theme === "dark" ? "brightness-0 invert" : "brightness-0"}`
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