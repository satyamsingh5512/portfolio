import { heroConfig, skillComponents, socialLinks } from '@/config/Hero';
import { parseTemplate } from '@/lib/hero';
import { cn } from '@/lib/utils';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

import Container from '../common/Container';
import Skill from '../common/Skill';
import CV from '../svgs/CV';
import Chat from '../svgs/Chat';
import { Button } from '../ui/button';
import { PixelatedCanvas } from '../ui/pixelated-canvas';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const buttonIcons = {
  CV: CV,
  Chat: Chat,
};

export default function Hero() {
  const { name, title, avatar, skills, description, buttons } = heroConfig;

  const renderDescription = () => {
    const parts = parseTemplate(description.template, skills);

    return parts.map((part) => {
      if (part.type === 'skill' && 'skill' in part && part.skill) {
        const SkillComponent =
          skillComponents[part.skill.component as keyof typeof skillComponents];
        return (
          <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
            <SkillComponent />
          </Skill>
        );
      } else if (part.type === 'bold' && 'text' in part) {
        return (
          <b key={part.key} className="whitespace-pre-wrap text-primary">
            {part.text}
          </b>
        );
      } else if (part.type === 'text' && 'text' in part) {
        return (
          <span key={part.key} className="whitespace-pre-wrap">
            {part.text}
          </span>
        );
      }
      return null;
    });
  };

  return (
    <Container className="mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Professional Image with Pixelated Effect */}
        <div className="flex-shrink-0">
          <PixelatedCanvas
            src="/assets/satyam-professional.jpg"
            width={300}
            height={400}
            cellSize={4}
            dotScale={0.8}
            shape="square"
            backgroundColor="transparent"
            dropoutStrength={0.3}
            interactive
            distortionStrength={5}
            distortionRadius={100}
            distortionMode="swirl"
            followSpeed={0.15}
            jitterStrength={3}
            jitterSpeed={2}
            sampleAverage
            tintColor="#3b82f6"
            tintStrength={0.1}
            className="rounded-2xl border border-border/50 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 text-center lg:text-left">
          {/* Small Avatar for Mobile */}
          <div className="lg:hidden mb-6">
            <Image
              src={avatar}
              alt="hero"
              width={80}
              height={80}
              className="size-20 rounded-full mx-auto dark:bg-yellow-300 bg-blue-300"
            />
          </div>

          {/* Text Area */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Hi, I&apos;m {name} — <span className="text-secondary">{title}</span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-base md:text-lg text-neutral-500 whitespace-pre-wrap">
              {renderDescription()}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4 justify-center lg:justify-start">
            {buttons.map((button, index) => {
              const IconComponent =
                buttonIcons[button.icon as keyof typeof buttonIcons];
              return (
                <Button
                  key={index}
                  variant={button.variant as 'outline' | 'default'}
                  className={cn(
                    button.variant === 'outline' &&
                      'inset-shadow-indigo-500',
                    button.variant === 'default' &&
                      'inset-shadow-indigo-500',
                  )}
                >
                  {IconComponent && <IconComponent />}
                  <Link href={button.href}>{button.text}</Link>
                </Button>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="mt-8 flex gap-2 justify-center lg:justify-start">
            {socialLinks.map((link) => (
              <Tooltip key={link.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    key={link.name}
                    className="text-secondary flex items-center gap-2"
                  >
                    <span className="size-6">{link.icon}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
