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
    title: 'VardaX',
    description:
      'ML-powered Web Application Firewall with real-time threat detection using behavioral analysis and anomaly detection. Features lightweight cloud-ready architecture with Python/Scikit-learn for ML models, Redis for caching, and Docker for deployment',
    image: '/project/VardaX.png',
    link: '#',
    technologies: [
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
      { name: 'Express.js', icon: <ExpressJs key="expressjs" /> },
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'Python', icon: <TypeScript key="python" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
    ],
    details: true,
    projectDetailsPageSlug: '/projects/vardax',
    isWorking: false,
  },
  {
    title: 'Ubuntu Clipboard Manager',
    description:
      'Native Ubuntu clipboard manager with Windows-style clipboard history. Built with Python and GTK/libadwaita for native desktop UI, D-Bus for system-level clipboard integration, SQLite for local storage, and Systemd for background service management',
    image: '/project/Paste-bin.png',
    link: '#',
    technologies: [
      { name: 'Python', icon: <TypeScript key="python" /> },
      { name: 'GTK', icon: <ReactIcon key="gtk" /> },
      { name: 'D-Bus', icon: <NodeJs key="dbus" /> },
      { name: 'SQLite', icon: <MongoDB key="sqlite" /> },
      { name: 'Linux', icon: <Vercel key="linux" /> },
    ],
    details: true,
    projectDetailsPageSlug: '/projects/ubuntu-clipboard-manager',
    isWorking: false,
  },
  {
    title: 'RetroPaste',
    description:
      'Terminal-themed pastebin with CRT effects, phosphor glow, and 8-bit sounds. Features AI-powered code analysis for security vulnerabilities and best practices, ephemeral pastes with view limits, auto language detection, and JWT authentication',
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
      'Full-stack study companion with smart task management, Pomodoro timer with session tracking, study analytics dashboard, real-time chat, and friend system. Deployed with Docker, PostgreSQL via Supabase, and CI/CD workflows',
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
    title: 'CroxShare',
    description:
      'P2P file sharing with WebRTC direct transfers, browser-native compression (85% savings on JSON), clipboard paste support, and real-time transfer analytics. Features pause/resume, sound effects, and Apple-inspired glassmorphic UI',
    image: '/project/crosx-share.png',
    link: 'https://croxshare.vercel.app/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'WebRTC', icon: <NodeJs key="webrtc" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
    ],
    github: 'https://github.com/satyamsingh5512/croxshare',
    live: 'https://croxshare.vercel.app/',
    details: true,
    projectDetailsPageSlug: '/projects/croxshare',
    isWorking: true,
  },
  {
    title: 'Spotify Now Playing',
    description:
      'Glassmorphic Spotify widget with real-time "Now Playing" display. Features SWR-based polling, Framer Motion animations, rotating album art, and macOS-inspired design. Integrates Spotify Web API with secure OAuth token handling',
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
      'Scalable ride-hailing microservices with geospatial driver matching using PostGIS, dynamic surge pricing algorithm, event-driven architecture with Kafka for real-time updates, Redis caching, and JWT authentication',
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
      'Real-time quiz platform with anti-cheat mechanisms including tab-switch detection and copy-paste blocking. Features live leaderboards, timed sessions, admin dashboard for quiz management, and WebSocket-based score updates serving 150+ concurrent users',
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
