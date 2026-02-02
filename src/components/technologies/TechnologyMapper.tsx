"use client";

import React from "react";

import AWS from "./AWS";
import Appwrite from "./Appwrite";
import BootStrap from "./BootStrap";
import Bun from "./Bun";
import CSS from "./CSS";
import ExpressJs from "./ExpressJs";
import Figma from "./Figma";
import GithubIcon from "./Github";
import Html from "./Html";
import JavaScript from "./JavaScript";
import MDXIcon from "./MDXIcon";
import MongoDB from "./MongoDB";
import Motion from "./Motion";
import NestJs from "./NestJs";
import Netlify from "./Netlify";
import NextJs from "./NextJs";
import Nginx from "./Nginx";
import NodeJs from "./NodeJs";
import PostgreSQL from "./PostgreSQL";
import Postman from "./Postman";
import Prisma from "./Prisma";
import ReactIcon from "./ReactIcon";
import Sanity from "./Sanity";
import Shadcn from "./Shadcn";
import SocketIo from "./SocketIo";
import TailwindCss from "./TailwindCss";
import ThreeJs from "./ThreeJs";
import TypeScript from "./TypeScript";
import Vercel from "./Vercel";

// Map technology names (case-insensitive) to their icon components
const technologyIconMap: Record<string, React.ReactNode> = {
  // JavaScript/TypeScript ecosystem
  javascript: <JavaScript />,
  js: <JavaScript />,
  typescript: <TypeScript />,
  ts: <TypeScript />,
  react: <ReactIcon />,
  reactjs: <ReactIcon />,
  "react.js": <ReactIcon />,
  nextjs: <NextJs />,
  "next.js": <NextJs />,
  next: <NextJs />,
  nodejs: <NodeJs />,
  "node.js": <NodeJs />,
  node: <NodeJs />,
  expressjs: <ExpressJs />,
  "express.js": <ExpressJs />,
  express: <ExpressJs />,
  nestjs: <NestJs />,
  "nest.js": <NestJs />,
  bun: <Bun />,

  // Styling
  css: <CSS />,
  css3: <CSS />,
  html: <Html />,
  html5: <Html />,
  tailwind: <TailwindCss />,
  tailwindcss: <TailwindCss />,
  bootstrap: <BootStrap />,
  shadcn: <Shadcn />,
  "shadcn/ui": <Shadcn />,

  // Databases
  mongodb: <MongoDB />,
  mongo: <MongoDB />,
  postgresql: <PostgreSQL />,
  postgres: <PostgreSQL />,
  prisma: <Prisma />,

  // Cloud & Deployment
  aws: <AWS />,
  vercel: <Vercel />,
  netlify: <Netlify />,
  nginx: <Nginx />,

  // Other tools
  figma: <Figma />,
  github: <GithubIcon />,
  postman: <Postman />,
  appwrite: <Appwrite />,
  sanity: <Sanity />,
  socketio: <SocketIo />,
  "socket.io": <SocketIo />,
  threejs: <ThreeJs />,
  "three.js": <ThreeJs />,
  motion: <Motion />,
  "framer-motion": <Motion />,
  mdx: <MDXIcon />,

  // Additional common technologies (fallback to closest match)
  python: <TypeScript />, // Using TypeScript icon as placeholder
  "c++": <NodeJs />, // Using Node as placeholder for compiled languages
  cpp: <NodeJs />,
  lua: <JavaScript />, // Using JS as placeholder
  sdl2: <NodeJs />,
  arduino: <NodeJs />,
  pygame: <ReactIcon />,
  ai: <Vercel />,
  docker: <Vercel />,
  fastapi: <ExpressJs />,
  pytorch: <NodeJs />,
  sqlite: <MongoDB />,
  electron: <NodeJs />,
  "electron.js": <NodeJs />,
  jspdf: <JavaScript />,
  "hc-sr04": <NodeJs />,
  "servo motor": <NodeJs />,
  linux: <Vercel />,
};

/**
 * Get the icon component for a technology name
 */
export function getTechnologyIcon(name: string): React.ReactNode {
  const normalizedName = name.toLowerCase().trim();
  return technologyIconMap[normalizedName] || <TypeScript />; // Default to TypeScript icon
}

/**
 * Convert technology string array to technology objects with icons
 */
export function mapTechnologiesToIcons(
  technologies: string[],
): { name: string; icon: React.ReactNode }[] {
  return technologies.map((tech) => ({
    name: tech,
    icon: getTechnologyIcon(tech),
  }));
}

interface TechnologyIconProps {
  name: string;
  className?: string;
}

/**
 * Component that renders a technology icon by name
 */
export function TechnologyIcon({ name, className }: TechnologyIconProps) {
  return <div className={className}>{getTechnologyIcon(name)}</div>;
}
