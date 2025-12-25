import { about, mySkills } from '@/config/About';
import Image from 'next/image';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export default function About() {
  return (
    <Container className="mt-12 sm:mt-20">
      <SectionHeading subHeading="About" heading="Me" />
      {/* About me */}
      <div className="mt-6 sm:mt-8 flex flex-col gap-4 md:flex-row md:gap-6">
        <Image
          src="/assets/profesional-image.png"
          alt="About"
          width={100}
          height={100}
          className="border-secondary size-40 sm:size-60 rounded-md border-2 bg-blue-300 dark:bg-yellow-300 mx-auto md:mx-0"
        />
        <div className="mt-2 sm:mt-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center md:text-left">{about.name}</h3>
          <p className="text-secondary text-sm sm:text-base mt-3 sm:mt-4">{about.description}</p>
          <p className="text-secondary mt-6 sm:mt-8 font-bold text-sm sm:text-base">Skills</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {mySkills.map((skill) => (
              <Tooltip key={skill.key}>
                <TooltipTrigger asChild>
                  <div className="mt-3 sm:mt-4 size-5 sm:size-6 hover:cursor-pointer">{skill}</div>
                </TooltipTrigger>
                <TooltipContent>{skill.key}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
