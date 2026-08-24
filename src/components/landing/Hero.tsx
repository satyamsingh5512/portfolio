import { heroConfig, skillComponents, socialLinks } from "@/config/Hero";
import { parseTemplate } from "@/lib/hero";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

import Container from "../common/Container";
import Skill from "../common/Skill";
import Chat from "../svgs/Chat";
import { Button } from "../ui/button";
import { Hint } from "../ui/hint";

const buttonIcons = {
  Chat: Chat,
};

/**
 * The hero is intentionally a server component with CSS-only entrance
 * animations: the previous JavaScript-driven variant started every element at
 * `opacity: 0`, so the largest contentful paint could not happen until the
 * bundle had downloaded, parsed and hydrated.
 */
export default function Hero() {
  const { name, title, avatar, skills, description, buttons } = heroConfig;
  const parts = parseTemplate(description.template, skills);

  const renderedDescription = parts.map((part) => {
    if (part.type === "skill" && "skill" in part && part.skill) {
      const SkillComponent =
        skillComponents[part.skill.component as keyof typeof skillComponents];
      if (!SkillComponent) return null;
      return (
        <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
          <SkillComponent />
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
      <div className="animate-rise-in">
        <Image
          src={avatar}
          alt={`${name} - ${title}`}
          width={96}
          height={96}
          className="size-20 rounded-full bg-blue-300 sm:size-24 dark:bg-yellow-300"
          priority
          fetchPriority="high"
          // Already a hand-sized 192px WebP, so skip the optimizer round trip.
          unoptimized
        />
      </div>

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
        {buttons.map((button) => {
          const IconComponent =
            buttonIcons[button.icon as keyof typeof buttonIcons];
          return (
            <Button
              key={button.href}
              asChild
              variant={button.variant as "outline" | "default"}
              size="default"
              className="min-h-11 text-sm inset-shadow-indigo-500 sm:text-base"
            >
              <Link href={button.href} prefetch={false}>
                {IconComponent && <IconComponent />}
                {button.text}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Social Links */}
      <div
        className="animate-rise-in mt-6 flex gap-2 sm:mt-8"
        style={{ animationDelay: "240ms" }}
      >
        {socialLinks.map((link) => (
          <Hint key={link.name} label={link.name}>
            <Link
              href={link.href}
              aria-label={link.label}
              className="text-secondary hover:text-primary inline-flex size-11 items-center justify-center rounded-md"
            >
              <span aria-hidden="true" className="size-5 sm:size-6">
                {link.icon}
              </span>
            </Link>
          </Hint>
        ))}
      </div>
    </Container>
  );
}
