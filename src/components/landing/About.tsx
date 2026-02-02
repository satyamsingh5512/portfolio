import { about, mySkills } from "@/config/About";
import Image from "next/image";
import React from "react";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function About() {
  return (
    <Container className="mt-12 sm:mt-20">
      <SectionHeading subHeading="About" heading="Me" />
      {/* About me */}
      <div className="mt-6 flex flex-col gap-4 sm:mt-8 md:flex-row md:gap-6">
        <Image
          src="/assets/profesional-image.png"
          alt="About"
          width={100}
          height={100}
          className="border-secondary mx-auto size-40 rounded-md border-2 bg-blue-300 sm:size-60 md:mx-0 dark:bg-yellow-300"
        />
        <div className="mt-2 sm:mt-4">
          <h3 className="text-center text-xl font-bold sm:text-2xl md:text-left">
            {about.name}
          </h3>
          <p className="text-secondary mt-3 text-sm sm:mt-4 sm:text-base">
            {about.description}
          </p>

          {/* Highlights Section */}
          <div className="mt-6 sm:mt-8">
            <h4 className="mb-4 text-sm font-bold sm:text-base">What I Do</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {about.highlights?.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-muted/50 border-border/50 rounded-lg border p-4"
                >
                  <h5 className="mb-2 text-sm font-semibold">
                    {highlight.title}
                  </h5>
                  <p className="text-secondary text-xs sm:text-sm">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mt-6 sm:mt-8">
            <h4 className="mb-4 text-sm font-bold sm:text-base">
              Core Expertise
            </h4>
            <ul className="space-y-2">
              {about.expertise?.map((skill, index) => (
                <li
                  key={index}
                  className="text-secondary flex items-start text-xs sm:text-sm"
                >
                  <span className="text-primary mt-1 mr-2">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-secondary mt-6 text-sm font-bold sm:mt-8 sm:text-base">
            Skills
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {mySkills.map((skill) => (
              <Tooltip key={skill.key}>
                <TooltipTrigger asChild>
                  <div className="mt-3 size-5 hover:cursor-pointer sm:mt-4 sm:size-6">
                    {skill}
                  </div>
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
