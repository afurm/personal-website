import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { StructuredData } from "@/components/ui/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrii Furmanets - Senior Full-Stack Developer | Fintech & Web3",
  description: "Experienced Senior Full-Stack Developer with expertise in React, Next.js, TypeScript, and Ruby on Rails, specializing in Fintech, Web3, and scalable software solutions.",
  keywords: [
    "Full-Stack Developer",
    "React Developer",
    "TypeScript Expert",
    "Next.js Developer",
    "Ruby on Rails Developer",
    "Web3 Development",
    "Fintech Solutions",
    "Healthcare Software",
    "JavaScript Developer",
    "Frontend Engineer",
    "Backend Developer",
    "Software Engineer"
  ],
  authors: [{ name: "Andrii Furmanets", url: "https://andriifurmanets.com" }],
  creator: "Andrii Furmanets",
  publisher: "Andrii Furmanets",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://andriifurmanets.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://andriifurmanets.com",
    title: "Andrii Furmanets - Senior Full-Stack Developer",
    description: "React, TypeScript, Next.js & Ruby on Rails expert. Proven track record in fintech, Web3, and scalable systems.",
    siteName: "Andrii Furmanets Portfolio",
    images: [
      {
        url: "/og-image.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Andrii Furmanets - Senior Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrii Furmanets - Senior Full-Stack Developer",
    description: "Expert in React, TypeScript, Next.js & Ruby on Rails. Specializing in fintech and Web3 solutions.",
    images: ["/og-image.jpg"], // Same image as OpenGraph
    creator: "@andriifurmanets", // Replace with your Twitter handle if you have one
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon - Light Mode */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Web Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StructuredData />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
