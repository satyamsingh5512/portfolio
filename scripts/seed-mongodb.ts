/**
 * MongoDB Seed Script
 * ==================
 * Clears all collections in the portfolio database and seeds
 * them with the initial data from the existing JSON files.
 *
 * Run with:  bun run scripts/seed-mongodb.ts
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set. Aborting.");
  process.exit(1);
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    short_description: String,
    description: String,
    technologies: [String],
    github_url: { type: String, default: null },
    live_url: { type: String, default: null },
    image: { type: String, default: null },
    featured: { type: Boolean, default: false },
    status: { type: String, default: "completed" },
    start_date: { type: String, default: null },
    end_date: { type: String, default: null },
    category: { type: String, default: null },
    order_index: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const SiteSettingSchema = new mongoose.Schema(
  { key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed },
  { timestamps: true },
);

const AchievementSchema = new mongoose.Schema(
  { title: String, issuer: String, date: String, file: String },
  { timestamps: true },
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    location: String,
    start_date: String,
    end_date: { type: String, default: null },
    description: [String],
    technologies: [String],
    is_current: { type: Boolean, default: false },
    company_url: String,
    logo: String,
  },
  { timestamps: true },
);

const BlogSchema = new mongoose.Schema(
  { title: String, description: String, url: String, date: String },
  { timestamps: true },
);

// ─── Models ─────────────────────────────────────────────────────────────────

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const SiteSetting = mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);
const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// ─── Data ───────────────────────────────────────────────────────────────────

function readJson<T>(relativePath: string): T {
  const full = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
}

interface RawProject {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  live?: string;
  technologies: string[];
  isWorking: boolean;
}

interface RawAchievement {
  title: string;
  issuer: string;
  date: string;
  file: string;
}

interface RawExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location: string;
  companyUrl?: string;
  logo?: string;
  technologies: string[];
  description: string[];
}

const rawProjects = readJson<RawProject[]>("src/data/projects.json");
const rawAchievements = readJson<RawAchievement[]>("src/data/achievements.json");
const rawExperiences = readJson<RawExperience[]>("src/data/experiences.json");

const projectDocs = rawProjects.map((p, i) => ({
  title: p.title,
  short_description: p.description.length > 200
    ? p.description.slice(0, 200) + "…"
    : p.description,
  description: p.description,
  technologies: p.technologies,
  github_url: p.github ?? (p.link?.startsWith("https://github") ? p.link : null),
  live_url: p.live ?? (p.link && !p.link.startsWith("https://github") ? p.link : null),
  image: p.image ?? null,
  featured: p.isWorking,
  status: "completed" as const,
  start_date: null,
  end_date: null,
  category: null,
  order_index: i,
}));

const achievementDocs = rawAchievements.map((a) => ({
  title: a.title,
  issuer: a.issuer,
  date: a.date,
  file: a.file,
}));

const experienceDocs = rawExperiences.map((e) => ({
  company: e.company,
  position: e.position,
  location: e.location,
  start_date: e.startDate,
  end_date: e.endDate ?? null,
  description: e.description,
  technologies: e.technologies,
  is_current: e.isCurrent,
  company_url: e.companyUrl,
  logo: e.logo,
}));

const siteSettingsDocs = [
  {
    key: "hero",
    value: {
      name: "Satyam",
      title: "Full Stack Developer",
      avatar: "/assets/satyam-avatar.png",
      description:
        "I am a <b>Full Stack Software Engineer</b> focused on designing and building scalable, production-ready systems that perform reliably under real-world constraints.",
      resumeUrl: "/assets/resume.pdf",
      contactUrl: "/contact",
      skills: [
        { name: "React", href: "https://react.dev/" },
        { name: "Next.js", href: "https://nextjs.org/" },
        { name: "Node.js", href: "https://nodejs.org/" },
        { name: "Express", href: "https://expressjs.com/" },
        { name: "PostgreSQL", href: "https://www.postgresql.org/" },
        { name: "MongoDB", href: "https://www.mongodb.com/" },
      ],
    },
  },
  {
    key: "about",
    value: {
      name: "Satyam",
      description:
        "Hey, I'm Satyam. I'm a 3rd-year B.Tech Computer Science student and a Full-Stack Developer with strong Machine Learning expertise, focused on building scalable, production-ready systems.\n\nI work across the entire stack, from designing robust backend architectures and APIs to building clean, high-performance user interfaces.\n\nTech Focus: Full-Stack Engineering · Machine Learning · Backend Systems · Scalable Architectures · Intelligent Applications",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
        "Next.js",
        "Python",
        "Machine Learning",
      ],
    },
  },
  {
    key: "socialLinks",
    value: [
      { name: "LinkedIn", href: "https://www.linkedin.com/in/satym5512/", icon: "linkedin" },
      { name: "Github", href: "https://github.com/satyamsingh5512", icon: "github" },
      { name: "Email", href: "mailto:satyamssinghpx@gmail.com", icon: "email" },
    ],
  },
  {
    key: "contact",
    value: {
      title: "Contact",
      description: "Get in touch with me. I will get back to you as soon as possible.",
      email: "satyamssinghpx@gmail.com",
    },
  },
  {
    key: "cta",
    value: {
      profileImage: "/assets/satyam-avatar.png",
      preText: "Hey, you scrolled this far, let's talk.",
      linkText: "Book a Free Call",
      calLink: "satyamsinghpx/meeting",
    },
  },
  {
    key: "footer",
    value: {
      developer: "Satyam",
      text: "Design & Developed by",
      copyright: "All rights reserved.",
    },
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI!, { dbName: "portfolio", bufferCommands: false });
  console.log("✅  Connected.");

  // ── Clear all collections ──────────────────────────────────────────────────
  console.log("\n🗑️   Clearing existing collections…");
  await Promise.all([
    Project.deleteMany({}),
    SiteSetting.deleteMany({}),
    Achievement.deleteMany({}),
    Experience.deleteMany({}),
    Blog.deleteMany({}),
  ]);
  console.log("   projects       → cleared");
  console.log("   site_settings  → cleared");
  console.log("   achievements   → cleared");
  console.log("   experiences    → cleared");
  console.log("   blogs          → cleared");

  // ── Seed ──────────────────────────────────────────────────────────────────
  console.log("\n🌱  Seeding data…");

  // Projects
  await Project.insertMany(projectDocs);
  console.log(`   projects       → ${projectDocs.length} documents`);

  // Site settings (upsert by key)
  for (const s of siteSettingsDocs) {
    await SiteSetting.findOneAndUpdate({ key: s.key }, s, { upsert: true, returnDocument: "after" });
  }
  console.log(`   site_settings  → ${siteSettingsDocs.length} keys`);

  // Achievements
  await Achievement.insertMany(achievementDocs);
  console.log(`   achievements   → ${achievementDocs.length} documents`);

  // Experiences
  await Experience.insertMany(experienceDocs);
  console.log(`   experiences    → ${experienceDocs.length} documents`);

  console.log(`   blogs          → (empty – add via admin panel)`);

  await mongoose.disconnect();
  console.log("\n🎉  Seed complete! MongoDB is ready.\n");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
