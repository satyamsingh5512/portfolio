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
import Spring from "./Spring";
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

  // Java ecosystem
  spring: <Spring />,
  "spring boot": <Spring />,
  springboot: <Spring />,
  "spring-boot": <Spring />,
  "spring framework": <Spring />,
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
};

/**
 * Shown for names with no dedicated icon (e.g. a skill just added in /admin):
 * the first letter in a rounded box, so it never impersonates another
 * technology's logo.
 */
function MonogramIcon({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <svg viewBox="0 0 128 128" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="116"
        height="116"
        rx="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <text
        x="64"
        y="66"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="72"
        fontWeight="700"
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

/**
 * Get the icon component for a technology name
 */
export function getTechnologyIcon(name: string): React.ReactNode {
  const normalizedName = name.toLowerCase().trim();
  return technologyIconMap[normalizedName] ?? <MonogramIcon name={name} />;
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
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * Component that renders a technology icon by name
 */
export function TechnologyIcon({
  name,
  className,
  ...rest
}: TechnologyIconProps) {
  return (
    <div className={className} {...rest}>
      {getTechnologyIcon(name)}
    </div>
  );
}
