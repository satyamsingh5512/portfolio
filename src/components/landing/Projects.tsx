import { projects as configProjects } from "@/config/Projects";
import { getFeaturedProjects } from "@/lib/projects-db";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { DBProjectList } from "../projects/DBProjectList";
import { ProjectList } from "../projects/ProjectList";
import { Button } from "../ui/button";

export default async function Projects() {
  // Try to fetch from DB first
  const dbProjects = await getFeaturedProjects();
  const hasDBProjects = dbProjects.length > 0;

  // Fallback to config projects, sorted by order, show only first 4
  const sortedConfigProjects = [...configProjects]
    .sort((a, b) => (a.order || 999) - (b.order || 999))
    .slice(0, 4);

  return (
    <Container className="mt-12 sm:mt-20">
      <FadeIn>
        <SectionHeading subHeading="Featured" heading="Projects" />
      </FadeIn>

      <FadeIn delay={0.1}>
        {hasDBProjects ? (
          <DBProjectList
            className="mt-6 sm:mt-8"
            projects={dbProjects.slice(0, 4)}
          />
        ) : (
          <ProjectList
            className="mt-6 sm:mt-8"
            projects={sortedConfigProjects}
          />
        )}
      </FadeIn>

      <FadeIn delay={0.2} direction="up" distance={10}>
        <div className="mt-6 flex justify-center sm:mt-8">
          <Button variant="outline" className="text-sm">
            <Link href="/projects">Show all projects</Link>
          </Button>
        </div>
      </FadeIn>
    </Container>
  );
}
