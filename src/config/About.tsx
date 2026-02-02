import Bun from "@/components/technologies/Bun";
import JavaScript from "@/components/technologies/JavaScript";
import MongoDB from "@/components/technologies/MongoDB";
import NextJs from "@/components/technologies/NextJs";
import NodeJs from "@/components/technologies/NodeJs";
import PostgreSQL from "@/components/technologies/PostgreSQL";
import Prisma from "@/components/technologies/Prisma";
import ReactIcon from "@/components/technologies/ReactIcon";
import TypeScript from "@/components/technologies/TypeScript";

export const mySkills = [
  <ReactIcon key="react" />,
  <Bun key="bun" />,
  <JavaScript key="javascript" />,
  <TypeScript key="typescript" />,
  <MongoDB key="mongodb" />,
  <NextJs key="nextjs" />,
  <NodeJs key="nodejs" />,
  <PostgreSQL key="postgresql" />,
  <Prisma key="prisma" />,
];

export const about = {
  name: "Satyam",
  description: "",
  highlights: [
    {
      title: "Full-Stack Development",
      description:
        "Experienced in building end-to-end web applications using modern technologies, from concept to deployment.",
    },
    {
      title: "Open Source Contributor",
      description:
        "Active contributor to open source projects, sharing knowledge and collaborating with the developer community.",
    },
    {
      title: "Product Builder",
      description:
        "Passionate about creating solutions that address real-world challenges and deliver tangible value to users.",
    },
    {
      title: "MVP Specialist",
      description:
        "Skilled in rapidly developing and iterating on minimum viable products to validate ideas and gather user feedback.",
    },
  ],
  expertise: [
    "Building scalable web applications with modern frameworks",
    "Developing machine learning solutions for practical applications",
    "Creating efficient backend systems and APIs",
    "Designing intuitive user interfaces and experiences",
    "Rapid prototyping and MVP development",
    "Open source collaboration and contribution",
  ],
};
