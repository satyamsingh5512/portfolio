import ExpressJs from '@/components/technologies/ExpressJs';
import MongoDB from '@/components/technologies/MongoDB';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import ReactIcon from '@/components/technologies/ReactIcon';
import Vercel from '@/components/technologies/Vercel';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'Ride-Hailing Backend',
    description:
      'Production-ready scalable ride-hailing backend with geospatial driver matching, dynamic surge pricing, event-driven architecture using Kafka, and secure JWT authentication',
    image: '/project/ride-hailing.png',
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
