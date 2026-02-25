import { type Experience, experiences } from "@/config/Experience";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { ExperienceCard } from "../experience/ExperienceCard";
import { Button } from "../ui/button";

export default function Experience() {
  return (
    <Container className="mt-12 sm:mt-20">
      <FadeIn>
        <SectionHeading subHeading="Featured" heading="Experience" />
      </FadeIn>
      <div className="mt-4 flex flex-col gap-4 sm:gap-8">
        {experiences
          .slice(0, 2)
          .map((experience: Experience, index: number) => (
            <FadeIn key={experience.id} delay={index * 0.1}>
              <ExperienceCard experience={experience} />
            </FadeIn>
          ))}
      </div>
      {experiences.length > 2 && (
        <FadeIn delay={0.3} direction="up" distance={10}>
          <div className="mt-6 flex justify-center sm:mt-8">
            <Button variant="outline" className="text-sm">
              <Link href="/work-experience">Show all work experiences</Link>
            </Button>
          </div>
        </FadeIn>
      )}
    </Container>
  );
}
