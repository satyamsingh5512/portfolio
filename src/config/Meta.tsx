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
  url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  ogImage: "/meta/opengraph-image.png",
  author: {
    name: about.name,
    twitter: "@satyamsinghpx",
    github: "satyamsinghpx",
    linkedin: "satyam-singh-px",
    email: "satyamsinghpx@gmail.com",
  },
  keywords: [
    "portfolio",
    "developer",
    "full-stack",
    "react",
    "nextjs",
    "nodejs",
    "typescript",
    "javascript",
    "web development",
    "backend developer",
    "frontend developer",
    "database design",
    "nist university",
    heroConfig.name.toLowerCase(),
  ],
};

export const pageMetadata: Record<string, PageMeta> = {
  // Home page
  "/": {
    title: `${heroConfig.name} - ${heroConfig.title}`,
    description: `${about.description} Explore my projects, experience, and technical expertise.`,
    keywords: [
      "portfolio",
      "developer",
      "full-stack",
      "web development",
      "projects",
    ],
    ogImage: "/meta/hero.png",
    twitterCard: "summary_large_image",
  },

  // Contact page
  "/contact": {
    title: "Contact - Get in Touch",
    description:
      "Get in touch with me for collaborations, projects, or opportunities. I'd love to hear from you!",
    keywords: ["contact", "hire", "collaboration", "freelance", "developer"],
    ogImage: "/assets/satyam-avatar.png",
    twitterCard: "summary",
  },

  // Work Experience page
  "/work-experience": {
    title: "Work Experience - Research & Development",
    description:
      "Explore my research experience in Machine Learning and Computer Vision at IIT Mandi, focusing on deep learning and remote sensing applications.",
    keywords: [
      "work experience",
      "research",
      "machine learning",
      "computer vision",
      "IIT Mandi",
      "deep learning",
      "PyTorch",
      "YOLO",
    ],
    ogImage: "/meta/work.png",
    twitterCard: "summary_large_image",
  },

  // Projects page
  "/projects": {
    title: "Projects - My Work & Projects Portfolio",
    description:
      "Discover my projects and work across different technologies and domains. From web apps to mobile solutions.",
    keywords: [
      "projects",
      "portfolio",
      "web development",
      "applications",
      "software",
    ],
    ogImage: "/meta/projects.png",
    twitterCard: "summary_large_image",
  },

  // Blog page
  "/blog": {
    title: "Blog - Thoughts & Tutorials",
    description:
      "Read my thoughts, tutorials, and insights on engineering, programming, and web development.",
    keywords: [
      "blog",
      "tutorials",
      "programming",
      "web development",
      "technical writing",
    ],
    ogImage: "/meta/blogs.png",
    twitterCard: "summary_large_image",
  },

  // Resume page
  "/resume": {
    title: "Resume - Professional CV",
    description: `View and download ${heroConfig.name}'s professional resume and CV. Technical skills, experience, and qualifications.`,
    keywords: [
      "resume",
      "cv",
      "professional",
      "skills",
      "qualifications",
      "download",
    ],
    ogImage: "/meta/resume.png",
    twitterCard: "summary",
  },

  // Gears page
  "/gears": {
    title: "Gears - My Setup & Tools",
    description:
      "Discover the tools, devices, and software I use to get my work done efficiently.",
    keywords: [
      "setup",
      "tools",
      "devices",
      "software",
      "productivity",
      "development environment",
    ],
    ogImage: "/meta/gears.png",
    twitterCard: "summary_large_image",
  },

  // Setup page
  "/setup": {
    title: "Setup Guide - VS Code Configuration",
    description:
      "Complete guide to setting up VS Code with my preferred configuration, extensions, and fonts for optimal development.",
    keywords: [
      "vscode",
      "setup",
      "configuration",
      "extensions",
      "development environment",
      "guide",
    ],
    ogImage: "/meta/setup.png",
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
  };
}
