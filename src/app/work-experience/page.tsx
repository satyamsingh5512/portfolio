import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { ExperienceList } from '@/components/experience/ExperienceList';
import { experiences } from '@/config/Experience';
import { generateMetadata } from '@/config/Meta';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata('/work-experience');

export default function WorkExperiencePage() {
  return (
    <Container className="min-h-screen py-10 sm:py-16">
      <SectionHeading 
        subHeading="Professional Journey" 
        heading="Work Experience" 
      />
      <div className="mt-6 sm:mt-8">
        <ExperienceList experiences={experiences} />
      </div>
    </Container>
  );
}