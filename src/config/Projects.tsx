import ExpressJs from '@/components/technologies/ExpressJs';
import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import ReactIcon from '@/components/technologies/ReactIcon';
import TypeScript from '@/components/technologies/TypeScript';
import Vercel from '@/components/technologies/Vercel';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'RetroPaste',
    description:
      'A modern code-sharing platform inspired by classic Pastebin, reimagined with authentic retro terminal aesthetics. RetroPaste combines CRT visual effects, AI-powered code analysis, ephemeral pastes, and collaborative editing using a fast, scalable Next.js architecture',
    image: '/project/retro-paste.png',
    link: 'https://retropaste.vercel.app/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
    ],
    github: 'https://github.com/satyamsingh5512/retropaste',
    live: 'https://retropaste.vercel.app/',
    details: true,
    projectDetailsPageSlug: '/projects/retropaste',
    isWorking: true,
  },
  {
    title: 'StudyBuddy',
    description:
      'AI-powered study companion for competitive exam preparation. Features smart task management, Pomodoro timer, study analytics, real-time chat, and friend system to enhance productivity and collaborative learning',
    image: '/project/study-buddy.png',
    link: 'https://studybuddyone.vercel.app/',
    technologies: [
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Express.js', icon: <ExpressJs key="expressjs" /> },
      { name: 'PostgreSQL', icon: <PostgreSQL key="postgresql" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
    ],
    github: 'https://github.com/satyamsingh5512/studybuddy',
    live: 'https://studybuddyone.vercel.app/',
    details: true,
    projectDetailsPageSlug: '/projects/studybuddy',
    isWorking: true,
  },
  {
    title: 'Spotify Now Playing',
    description:
      'A real-time Spotify "Now Playing" pill widget implemented with Next.js App Router and TypeScript. Integrates Spotify Web API with secure token handling, SWR-based polling, Framer Motion animations, and a responsive glassmorphic UI',
    image: '/project/spotify-client.png',
    link: 'https://spotify-now-client.vercel.app/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'Spotify API', icon: <NodeJs key="spotify" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
    ],
    github: 'https://github.com/satyamsingh5512/spotify-now-client',
    live: 'https://spotify-now-client.vercel.app/',
    details: true,
    projectDetailsPageSlug: '/projects/spotify-now-playing',
    isWorking: true,
  },
  {
    title: 'Ride-Hailing Backend',
    description:
      'Production-ready scalable ride-hailing backend with geospatial driver matching, dynamic surge pricing, event-driven architecture using Kafka, and secure JWT authentication',
    image: '/project/ride-Handlin-Back.png',
    link: 'https://github.com/satyamsinghpx/ride-hailing-backend',
    technologies: [
      { name: 'Spring Boot', icon: <NodeJs key="springboot" /> },
      { name: 'PostgreSQL', icon: <PostgreSQL key="postgresql" /> },
      { name: 'Redis', icon: <MongoDB key="redis" /> },
      { name: 'Kafka', icon: <ExpressJs key="kafka" /> },
      { name: 'Docker', icon: <Vercel key="docker" /> },
    ],
    github: 'https://github.com/satyamsinghpx/ride-hailing-backend',
    details: true,
    projectDetailsPageSlug: '/projects/ride-hailing-backend',
    isWorking: true,
  },
  {
    title: 'Quizo',
    description:
      'Advanced quiz platform with anti-cheat mechanisms, live score tracking, and session management serving 150+ users',
    image: '/project/quizo.png',
    link: 'https://quizo.live',
    technologies: [
      { name: 'React.js', icon: <ReactIcon key="react" /> },
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
      { name: 'Express.js', icon: <ExpressJs key="expressjs" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
    ],
    live: 'https://quizo.live',
    details: true,
    projectDetailsPageSlug: '/projects/quizo-platform',
    isWorking: true,
  },
];
