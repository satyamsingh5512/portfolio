import Github from "@/components/svgs/Github";
import LinkedIn from "@/components/svgs/LinkedIn";
import Mail from "@/components/svgs/Mail";
import Website from "@/components/svgs/Website";
import X from "@/components/svgs/X";
import { getTechnologyIcon } from "@/components/technologies/TechnologyMapper";
import { parseTemplate } from "@/lib/hero";
import { canOptimizeImage } from "@/lib/image";
import { type SocialLink, getSiteSettings } from "@/lib/site-settings";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

import Container from "../common/Container";
import Skill from "../common/Skill";
import CV from "../svgs/CV";
import Chat from "../svgs/Chat";
import { Button } from "../ui/button";
import { Hint } from "../ui/hint";

const socialIcons: Record<SocialLink["icon"], React.ReactNode> = {
  linkedin: <LinkedIn />,
  github: <Github />,
  email: <Mail />,
  twitter: <X />,
  instagram: <Website />,
  youtube: <Website />,
  website: <Website />,
};

/**
 * The hero is intentionally a server component with CSS-only entrance
 * animations: the previous JavaScript-driven variant started every element at
 * `opacity: 0`, so the largest contentful paint could not happen until the
 * bundle had downloaded, parsed and hydrated.
 *
 * Content comes from the "Hero" and "Social" sections of /admin → Site Settings.
 */
export default async function Hero() {
  const { hero, socialLinks } = await getSiteSettings();
  const { name, title, avatar, skills, description, resumeUrl, contactUrl } =
    hero;
  const parts = parseTemplate(description, skills);

  const renderedDescription = parts.map((part) => {
    if (part.type === "skill" && "skill" in part && part.skill) {
      return (
        <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
          {getTechnologyIcon(part.skill.name)}
        </Skill>
      );
    }
    if (part.type === "bold" && "text" in part) {
      return (
        <b key={part.key} className="text-primary whitespace-pre-wrap">
          {part.text}
        </b>
      );
    }
    if (part.type === "text" && "text" in part) {
      return (
        <span key={part.key} className="whitespace-pre-wrap">
          {part.text}
        </span>
      );
    }
    return null;
  });

  return (
    <Container as="section" aria-label="Introduction" className="px-4 sm:px-6">
      {/* Avatar Image */}
      {avatar && (
        <div className="animate-rise-in">
          <Image
            src={avatar}
            alt={`${name} - ${title}`}
            width={96}
            height={96}
            className="size-20 rounded-full bg-blue-300 object-cover sm:size-24 dark:bg-yellow-300"
            priority
            fetchPriority="high"
            // The default avatar is a hand-sized 192px WebP, so skip the
            // optimizer round trip for it (and for hosts it can't fetch).
            unoptimized={!canOptimizeImage(avatar) || avatar.endsWith(".webp")}
          />
        </div>
      )}

      {/* Text Area */}
      <div className="mt-6 flex flex-col gap-2 sm:mt-8">
        <h1 className="animate-rise-in font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl">
          Hi, I&apos;m {name} — <span className="text-secondary">{title}</span>
        </h1>

        <div
          className="animate-rise-in text-secondary mt-3 flex flex-wrap items-center gap-y-2 text-sm sm:mt-4 sm:text-base md:text-lg"
          style={{ animationDelay: "80ms" }}
        >
          {renderedDescription}
        </div>
      </div>

      {/* Buttons */}
      <div
        className="animate-rise-in mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4"
        style={{ animationDelay: "160ms" }}
      >
        {resumeUrl && (
          <Button
            asChild
            variant="outline"
            size="default"
            className="min-h-11 text-sm sm:text-base"
          >
            <Link href={resumeUrl} target="_blank" prefetch={false}>
              <CV />
              Resume
            </Link>
          </Button>
        )}
        <Button
          asChild
          variant="default"
          size="default"
          className="min-h-11 text-sm inset-shadow-indigo-500 sm:text-base"
        >
          <Link href={contactUrl || "/contact"} prefetch={false}>
            <Chat />
            Get in touch
          </Link>
        </Button>
      </div>

      {/* Social Links */}
      <div
        className="animate-rise-in mt-6 flex gap-2 sm:mt-8"
        style={{ animationDelay: "240ms" }}
      >
        {socialLinks
          .filter((link) => link.href)
          .map((link) => (
            <Hint key={`${link.name}-${link.href}`} label={link.name}>
              <Link
                href={link.href}
                aria-label={`${name} on ${link.name}`}
                className="text-secondary hover:text-primary inline-flex size-11 items-center justify-center rounded-md"
              >
                <span aria-hidden="true" className="size-5 sm:size-6">
                  {socialIcons[link.icon] ?? <Website />}
                </span>
              </Link>
            </Hint>
          ))}
      </div>
    </Container>
  );
}
