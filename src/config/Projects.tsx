import ExpressJs from "@/components/technologies/ExpressJs";
import MongoDB from "@/components/technologies/MongoDB";
import NextJs from "@/components/technologies/NextJs";
import Nginx from "@/components/technologies/Nginx";
import NodeJs from "@/components/technologies/NodeJs";
import PostgreSQL from "@/components/technologies/PostgreSQL";
import ReactIcon from "@/components/technologies/ReactIcon";
import TailwindCss from "@/components/technologies/TailwindCss";
import TypeScript from "@/components/technologies/TypeScript";
import Vercel from "@/components/technologies/Vercel";
import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    title: "Formlytics",
    description:
      "Google Forms–style form builder with a minimal black-and-white design. Features drag-and-drop form creation, quiz builder, response analytics with Recharts, NextAuth.js authentication, and Prisma ORM with MongoDB for scalable data storage",
    image: "/project/formlytics.png",
    link: "https://formlyticx.vercel.app/",
    technologies: [
      { name: "Next.js", icon: <NextJs key="nextjs" /> },
      { name: "TypeScript", icon: <TypeScript key="typescript" /> },
      { name: "MongoDB", icon: <MongoDB key="mongodb" /> },
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    live: "https://formlyticx.vercel.app/",
    details: true,
    projectDetailsPageSlug: "/projects/formlytics",
    isWorking: true,
    order: 1,
  },
  {
    title: "VARDAx",
    description:
      "Next-generation ML-powered Web Application Firewall that detects zero-day attacks using behavioral analysis and ensemble learning models (Isolation Forest, Autoencoders, BERT). Features real-time threat visualization and explainable AI decisions.",
    image: "/project/VardaX.png",
    link: "#",
    technologies: [
      { name: "Python", icon: <TypeScript key="python" /> },
      { name: "PyTorch", icon: <NodeJs key="pytorch" /> },
      { name: "FastAPI", icon: <ExpressJs key="fastapi" /> },
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "Nginx", icon: <Nginx key="nginx" /> },
      { name: "Docker", icon: <Vercel key="docker" /> },
    ],
    details: true,
    projectDetailsPageSlug: "/projects/vardax",
    isWorking: false,
    order: 2,
  },
  {
    title: "Ubuntu Clipboard Manager",
    description:
      "A Linux-native clipboard management application with real-time clipboard tracking, persistent history, global shortcuts, system tray integration, and privacy-first local storage, built using Electron, React, and SQLite",
    image: "/project/Paste-bin.png",
    link: "#",
    technologies: [
      { name: "Electron.js", icon: <NodeJs key="electron" /> },
      { name: "React.js", icon: <ReactIcon key="react" /> },
      { name: "Tailwind CSS", icon: <TailwindCss key="tailwind" /> },
      { name: "SQLite", icon: <MongoDB key="sqlite" /> },
      { name: "Linux", icon: <Vercel key="linux" /> },
    ],
    details: true,
    projectDetailsPageSlug: "/projects/ubuntu-clipboard-manager",
    isWorking: false,
    order: 3,
  },
  {
    title: "RetroPaste",
    description:
      "Terminal-themed pastebin with CRT effects, phosphor glow, and 8-bit sounds. Features AI-powered code analysis for security vulnerabilities and best practices, ephemeral pastes with view limits, auto language detection, and JWT authentication",
    image: "/project/retro-paste.png",
    link: "https://retropaste.vercel.app/",
    technologies: [
      { name: "Next.js", icon: <NextJs key="nextjs" /> },
      { name: "TypeScript", icon: <TypeScript key="typescript" /> },
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "MongoDB", icon: <MongoDB key="mongodb" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    github: "https://github.com/satyamsingh5512/retropaste",
    live: "https://retropaste.vercel.app/",
    details: true,
    projectDetailsPageSlug: "/projects/retropaste",
    isWorking: true,
    order: 4,
  },
  {
    title: "StudyBuddy",
    description:
      "Full-stack study companion with smart task management, Pomodoro timer with session tracking, study analytics dashboard, real-time chat, and friend system. Deployed with Docker, PostgreSQL via Supabase, and CI/CD workflows",
    image: "/project/study-buddy.png",
    link: "https://sbd.satym.in",
    technologies: [
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "TypeScript", icon: <TypeScript key="typescript" /> },
      { name: "Express.js", icon: <ExpressJs key="expressjs" /> },
      { name: "PostgreSQL", icon: <PostgreSQL key="postgresql" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    github: "https://github.com/satyamsingh5512/studybuddy",
    live: "https://sbd.satym.in",
    details: true,
    projectDetailsPageSlug: "/projects/studybuddy",
    isWorking: true,
    order: 5,
  },
  {
    title: "CroxShare",
    description:
      "P2P file sharing with WebRTC direct transfers, browser-native compression (85% savings on JSON), clipboard paste support, and real-time transfer analytics. Features pause/resume, sound effects, and Apple-inspired glassmorphic UI",
    image: "/project/crosx-share.png",
    link: "https://croxshare.vercel.app/",
    technologies: [
      { name: "Next.js", icon: <NextJs key="nextjs" /> },
      { name: "TypeScript", icon: <TypeScript key="typescript" /> },
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "WebRTC", icon: <NodeJs key="webrtc" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    github: "https://github.com/satyamsingh5512/croxshare",
    live: "https://croxshare.vercel.app/",
    details: true,
    projectDetailsPageSlug: "/projects/croxshare",
    isWorking: true,
    order: 6,
  },
  {
    title: "Spotify Now Playing",
    description:
      'Glassmorphic Spotify widget with real-time "Now Playing" display. Features SWR-based polling, Framer Motion animations, rotating album art, and macOS-inspired design. Integrates Spotify Web API with secure OAuth token handling',
    image: "/project/spotify-client.png",
    link: "https://spotify-now-client.vercel.app/",
    technologies: [
      { name: "Next.js", icon: <NextJs key="nextjs" /> },
      { name: "TypeScript", icon: <TypeScript key="typescript" /> },
      { name: "React", icon: <ReactIcon key="react" /> },
      { name: "Spotify API", icon: <NodeJs key="spotify" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    github: "https://github.com/satyamsingh5512/spotify-now-client",
    live: "https://spotify-now-client.vercel.app/",
    details: true,
    projectDetailsPageSlug: "/projects/spotify-now-playing",
    isWorking: true,
    order: 7,
  },
  {
    title: "Ride-Hailing Backend",
    description:
      "Scalable ride-hailing microservices with geospatial driver matching using PostGIS, dynamic surge pricing algorithm, event-driven architecture with Kafka for real-time updates, Redis caching, and JWT authentication",
    image: "/project/ride-Handlin-Back.png",
    link: "https://github.com/satyamsinghpx/ride-hailing-backend",
    technologies: [
      { name: "Spring Boot", icon: <NodeJs key="springboot" /> },
      { name: "PostgreSQL", icon: <PostgreSQL key="postgresql" /> },
      { name: "Redis", icon: <MongoDB key="redis" /> },
      { name: "Kafka", icon: <ExpressJs key="kafka" /> },
      { name: "Docker", icon: <Vercel key="docker" /> },
    ],
    github: "https://github.com/satyamsinghpx/ride-hailing-backend",
    details: true,
    projectDetailsPageSlug: "/projects/ride-hailing-backend",
    isWorking: true,
    order: 8,
  },
  {
    title: "Quizo",
    description:
      "Real-time quiz platform with anti-cheat mechanisms including tab-switch detection and copy-paste blocking. Features live leaderboards, timed sessions, admin dashboard for quiz management, and WebSocket-based score updates serving 150+ concurrent users",
    image: "/project/quizo.png",
    link: "https://quizo.live",
    technologies: [
      { name: "React.js", icon: <ReactIcon key="react" /> },
      { name: "Node.js", icon: <NodeJs key="nodejs" /> },
      { name: "Express.js", icon: <ExpressJs key="expressjs" /> },
      { name: "MongoDB", icon: <MongoDB key="mongodb" /> },
      { name: "Vercel", icon: <Vercel key="vercel" /> },
    ],
    live: "https://quizo.live",
    details: true,
    projectDetailsPageSlug: "/projects/quizo-platform",
    isWorking: true,
    order: 9,
  },
];
