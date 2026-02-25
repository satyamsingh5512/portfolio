"use client";

import { heroConfig, skillComponents, socialLinks } from "@/config/Hero";
import { parseTemplate } from "@/lib/hero";
import { cn } from "@/lib/utils";
import { type Variants, motion } from "motion/react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React, { useMemo } from "react";

import Container from "../common/Container";
import Skill from "../common/Skill";
import Chat from "../svgs/Chat";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const buttonIcons = {
  Chat: Chat,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  const { name, title, avatar, skills, description, buttons } = heroConfig;

  const renderedDescription = useMemo(() => {
    const parts = parseTemplate(description.template, skills);

    return parts.map((part) => {
      if (part.type === "skill" && "skill" in part && part.skill) {
        const SkillComponent =
          skillComponents[part.skill.component as keyof typeof skillComponents];
        if (!SkillComponent) return null;
        return (
          <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
            <SkillComponent />
          </Skill>
        );
      } else if (part.type === "bold" && "text" in part) {
        return (
          <b key={part.key} className="text-primary whitespace-pre-wrap">
            {part.text}
          </b>
        );
      } else if (part.type === "text" && "text" in part) {
        return (
          <span key={part.key} className="whitespace-pre-wrap">
            {part.text}
          </span>
        );
      }
      return null;
    });
  }, [description.template, skills]);

  return (
    <Container className="mx-auto max-w-5xl px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar Image */}
        <motion.div variants={itemVariants}>
          <Image
            src={avatar}
            alt="hero"
            width={100}
            height={100}
            className="size-20 rounded-full bg-blue-300 sm:size-24 dark:bg-yellow-300"
            priority
          />
        </motion.div>

        {/* Text Area */}
        <div className="mt-6 flex flex-col gap-2 sm:mt-8">
          <motion.h1
            variants={itemVariants}
            className="font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Hi, I&apos;m {name} —{" "}
            <span className="text-secondary">{title}</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="mt-3 flex flex-wrap items-center gap-y-2 text-sm text-neutral-500 sm:mt-4 sm:text-base md:text-lg"
          >
            {renderedDescription}
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4"
        >
          {buttons.map((button, index) => {
            const IconComponent =
              buttonIcons[button.icon as keyof typeof buttonIcons];
            return (
              <Button
                key={index}
                variant={button.variant as "outline" | "default"}
                size="default"
                className={cn(
                  "text-sm sm:text-base",
                  button.variant === "outline" && "inset-shadow-indigo-500",
                  button.variant === "default" && "inset-shadow-indigo-500",
                )}
              >
                {IconComponent && <IconComponent />}
                <Link href={button.href}>{button.text}</Link>
              </Button>
            );
          })}
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="mt-6 flex gap-2 sm:mt-8">
          {socialLinks.map((link) => (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  key={link.name}
                  className="text-secondary flex items-center gap-2"
                >
                  <span className="size-5 sm:size-6">{link.icon}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
}
