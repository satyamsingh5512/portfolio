import { type Experience, experiences } from '@/config/Experience';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ExperienceCard } from '../experience/ExperienceCard';
import { Button } from '../ui/button';

export default function Experience() {
  return (
    <Container className="mt-12 sm:mt-20">
      <SectionHeading subHeading="Featured" heading="Experience" />
      <div className="mt-4 flex flex-col gap-4 sm:gap-8">
        {experiences.slice(0, 2).map((experience: Experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
      {experiences.length > 2 && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button variant="outline" className="text-sm">
            <Link href="/work-experience">Show all work experiences</Link>
          </Button>
        </div>
      )}
    </Container>
  );
}