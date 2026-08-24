import { SITE_URL } from "@/lib/site-url";

import { about } from "./About";
import { heroConfig } from "./Hero";

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
}

// Base site configuration
export const siteConfig = {
  name: heroConfig.name,
  title: "Sleek Portfolio",
  description:
    "Full Stack Developer - Satyam Portfolio | NIST University | Web Development Expert",
  url: SITE_URL,
  icon: "/meta/icon-192.png",
  ogImage:
    "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768661/portfolio/meta/file.png",
  author: {
    name: about.name,
    twitter: "@satyamsinghpx",
    github: "satyamsinghpx",
    linkedin: "satyam-singh-px",
    email: "satyamsinghpx@gmail.com",
  },
  keywords: [
    heroConfig.name.toLowerCase(),
    "satyam",
    "satyam singh",
    "portfolio",
    "full stack developer",
    "full stack system design engineer",
    "software engineer",
    "react developer",
    "next.js developer",
    "node.js developer",
    "react",
    "next.js",
    "nodejs",
    "express.js",
    "typescript",
    "javascript",
    "postgresql",
    "mongodb",
    "prisma",
    "bun",
    "web development",
    "backend developer",
    "frontend developer",
    "system design",
    "database design",
    "scalable web applications",
    "api development",
    "nist university",
  ],
};

export const pageMetadata: Record<string, PageMeta> = {
  // Home page
  "/": {
    title: `${heroConfig.name} - ${heroConfig.title}`,
    description: `${about.description} Explore my projects, experience, and technical expertise.`,
    keywords: [
      heroConfig.name.toLowerCase(),
      "satyam singh",
      "portfolio",
      "full stack developer",
      "full stack system design engineer",
      "software engineer",
      "react",
      "next.js",
      "node.js",
      "express",
      "postgresql",
      "mongodb",
      "typescript",
      "web development",
      "scalable systems",
      "projects",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768665/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Contact page
  "/contact": {
    title: "Contact - Get in Touch",
    description:
      "Get in touch with me for collaborations, projects, or opportunities. I'd love to hear from you!",
    keywords: [
      "contact satyam",
      "hire full stack developer",
      "hire react developer",
      "collaboration",
      "freelance developer",
      "software engineer for hire",
      "get in touch",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771769099/portfolio/assets/q0j3puiqnaelv5wp3jhj.jpg",
    twitterCard: "summary",
  },

  // Work Experience page
  "/work-experience": {
    title: "Work Experience - Research & Development",
    description:
      "Explore my research experience in Machine Learning and Computer Vision at IIT Mandi, focusing on deep learning and remote sensing applications.",
    keywords: [
      "work experience",
      "research experience",
      "machine learning",
      "computer vision",
      "iit mandi",
      "deep learning",
      "pytorch",
      "yolo",
      "remote sensing",
      "software engineer experience",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768674/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Projects page
  "/projects": {
    title: "Projects - My Work & Projects Portfolio",
    description:
      "Discover my projects and work across different technologies and domains. From web apps to mobile solutions.",
    keywords: [
      "projects",
      "portfolio projects",
      "web development projects",
      "full stack projects",
      "react projects",
      "next.js projects",
      "node.js projects",
      "software applications",
      "case studies",
      "open source",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768672/portfolio/meta/file.jpg",
    twitterCard: "summary_large_image",
  },

  // Blog page
  "/blog": {
    title: "Blog - Thoughts & Tutorials",
    description:
      "Read my thoughts, tutorials, and insights on engineering, programming, and web development.",
    keywords: [
      "developer blog",
      "programming tutorials",
      "web development blog",
      "software engineering blog",
      "react tutorials",
      "next.js tutorials",
      "typescript tutorials",
      "technical writing",
      "coding tips",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768658/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Journey page
  "/journey": {
    title: "Journey - Timeline & Milestones",
    description:
      "A timeline of my learning journey, projects, and career milestones as a full-stack software engineer.",
    keywords: [
      "developer journey",
      "career timeline",
      "learning journey",
      "milestones",
      "software engineer career",
      "growth story",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768658/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Journey certificates page
  "/journey/certificates": {
    title: "Certificates & Achievements",
    description:
      "A curated list of my professional certificates, courses, and notable achievements.",
    keywords: [
      "certificates",
      "achievements",
      "certifications",
      "courses completed",
      "professional development",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768658/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Gears page
  "/gears": {
    title: "Gears - My Setup & Tools",
    description:
      "Discover the tools, devices, and software I use to get my work done efficiently.",
    keywords: [
      "developer setup",
      "developer tools",
      "tech gear",
      "productivity tools",
      "hardware setup",
      "software tools",
      "development environment",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768667/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },

  // Setup page
  "/setup": {
    title: "Setup Guide - VS Code Configuration",
    description:
      "Complete guide to setting up VS Code with my preferred configuration, extensions, and fonts for optimal development.",
    keywords: [
      "vscode setup",
      "vscode configuration",
      "vscode extensions",
      "developer environment setup",
      "coding setup guide",
      "productivity guide",
    ],
    ogImage:
      "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768670/portfolio/meta/file.png",
    twitterCard: "summary_large_image",
  },
};

// Helper function to get metadata for a specific page
export function getPageMetadata(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata["/"];
}

// Helper function to generate complete metadata object for Next.js
export function generateMetadata(pathname: string) {
  const pageMeta = getPageMetadata(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords?.join(", "),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${pathname}`,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.title,
      images: [
        {
          url: pageMeta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      card: pageMeta.twitterCard || "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      images: [pageMeta.ogImage || siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
    icons: {
      icon: [
        { url: "/meta/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/meta/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/meta/icon-32.png",
      apple: {
        url: "/meta/apple-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    },
  };
}
