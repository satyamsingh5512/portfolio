'use client';

import { projects } from '@/config/Projects';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ProjectList } from '../projects/ProjectList';
import { Button } from '../ui/button';

export default function Projects() {
  return (
    <Container className="mt-12 sm:mt-20">
      <SectionHeading subHeading="Featured" heading="Projects" />

      <ProjectList className="mt-6 sm:mt-8" projects={projects.slice(0, 4)} />
      <div className="mt-6 sm:mt-8 flex justify-center">
        <Button variant="outline" className="text-sm">
          <Link href="/projects">Show all projects</Link>
        </Button>
      </div>
    </Container>
  );
}
