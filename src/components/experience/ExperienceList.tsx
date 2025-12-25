import { type Experience } from '@/config/Experience';
import React from 'react';

import { ExperienceCard } from './ExperienceCard';

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-muted-foreground text-sm sm:text-base">No work experiences found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {experiences.map((experience: Experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}