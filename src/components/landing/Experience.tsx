import { type Experience } from "@/config/Experience";
import { getSiteExperiences } from "@/lib/content";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { ExperienceCard } from "../experience/ExperienceCard";
import { Button } from "../ui/button";

/** Entries come from /admin → Experiences (config fallback until first edit). */
export default async function Experience() {
  const experiences = await getSiteExperiences();
  if (experiences.length === 0) return null;

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
            <Button asChild variant="outline" className="min-h-11 text-sm">
              <Link href="/work-experience" prefetch={false}>
                Show all work experiences
              </Link>
            </Button>
          </div>
        </FadeIn>
      )}
    </Container>
  );
}
