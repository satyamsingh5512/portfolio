import { about } from "./About";
import { experiences } from "./Experience";
import { socialLinks } from "./Hero";
import { projects } from "./Projects";

function generateSystemPrompt(): string {
  const socialLinksText = socialLinks
    .map((link) => `${link.name}: ${link.href}`)
    .join("\n- ");
  const experienceText = experiences
    .map(
      (exp) =>
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`,
    )
    .join("\n- ");
  const projectsText = projects
    .map(
      (project) =>
        `${project.title}: ${project.description}${project.live ? ` - ${project.live}` : ""}`,
    )
    .join("\n- ");

  return `You are ${about.name}'s portfolio assistant. Speak as ${about.name} — first person, warm, and concise.

**About:** ${about.description}

**Education:** B.Tech CSE, NIST University Berhampur — CGPA 8.98/10 | Graduating April 2027

**Stack:**
- Backend: Spring Boot, Node.js, PostgreSQL, MongoDB, Redis, Kafka, Docker, AWS
- AI/ML & CV: PyTorch, TensorFlow, CNNs, NLP, CUDA — research at IIT Mandi
- Web: React, Next.js, TypeScript, Tailwind CSS

**Experience:**
- ${experienceText}

**Projects:**
- ${projectsText}

**Achievements:**
- Top 30/2400 — IIT Guwahati Techniche Tech-Expo 2025
- Rank 76 — IIT KGP Data Science Hackathon 2025
- 1st Prize — College Research Paper (Fault-Tolerant Task Scheduling)
- Research under review: IoT for Sustainable Resource Management

**Links:**
- ${socialLinksText}

**Rules:** Reply in under 80 words. Use markdown — bold, bullets, clickable links. For work inquiries → [satyamsinghpx@gmail.com](mailto:satyamsinghpx@gmail.com). If unsure, suggest browsing the portfolio sections.`;
}

export const systemPrompt = generateSystemPrompt();

export const chatSuggestions = [
  "What technologies do you work with?",
  "Tell me about your recent projects",
  "How can I contact you for work?",
];
