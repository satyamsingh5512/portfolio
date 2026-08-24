import { about, mySkills } from "@/config/About";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { Hint } from "../ui/hint";

export default function About() {
  return (
    <Container className="mt-12 sm:mt-20">
      <FadeIn>
        <SectionHeading subHeading="About" heading="Me" />
      </FadeIn>
      {/* About me */}
      <div className="mt-6 sm:mt-8">
        <div>
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-bold sm:text-2xl">{about.name}</h3>
            <p className="text-secondary mt-3 text-sm sm:mt-4 sm:text-base">
              {about.description}
            </p>
          </FadeIn>

          {/* Highlights Section */}
          <div className="mt-6 sm:mt-8">
            <FadeIn delay={0.2}>
              <h4 className="mb-4 text-sm font-bold sm:text-base">What I Do</h4>
            </FadeIn>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {about.highlights?.map((highlight, index) => (
                <FadeIn key={index} delay={0.1 * index + 0.3} direction="right">
                  <div className="bg-muted/50 border-border/50 hover:border-primary/50 rounded-lg border p-4 transition-all duration-300">
                    <h5 className="mb-2 text-sm font-semibold">
                      {highlight.title}
                    </h5>
                    <p className="text-secondary text-xs sm:text-sm">
                      {highlight.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mt-6 sm:mt-8">
            <FadeIn delay={0.4}>
              <h4 className="mb-4 text-sm font-bold sm:text-base">
                Core Expertise
              </h4>
            </FadeIn>
            <ul className="space-y-2">
              {about.expertise?.map((skill, index) => (
                <li
                  key={index}
                  className="text-secondary flex items-start text-xs sm:text-sm"
                >
                  <FadeIn
                    delay={0.05 * index + 0.5}
                    direction="left"
                    distance={10}
                    className="flex items-start"
                  >
                    <span aria-hidden="true" className="text-primary mt-1 mr-2">
                      •
                    </span>
                    {skill}
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>

          <FadeIn delay={0.6}>
            <p className="text-secondary mt-6 text-sm font-bold sm:mt-8 sm:text-base">
              Skills
            </p>
          </FadeIn>
          <div className="mt-3 flex flex-wrap justify-center gap-3 sm:mt-4 md:justify-start">
            {mySkills.map((skill, index) => (
              <Hint key={skill.key} label={String(skill.key)} srOnlyLabel>
                <FadeIn
                  delay={0.05 * index + 0.7}
                  direction="none"
                  className="flex size-5 items-center justify-center sm:size-6"
                >
                  <span aria-hidden="true" className="block size-5 sm:size-6">
                    {skill}
                  </span>
                </FadeIn>
              </Hint>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
