import { projects as configProjects } from "@/config/Projects";
import { getSiteProjects } from "@/lib/content";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { DBProjectList } from "../projects/DBProjectList";
import { ProjectList } from "../projects/ProjectList";
import { Button } from "../ui/button";

export default async function Projects() {
  // DB (managed from /admin → Projects) wins; `null` means never used → config.
  const dbProjects = await getSiteProjects();
  const hasDBProjects = dbProjects !== null;
  const featured = dbProjects?.filter((project) => project.featured) ?? [];
  const landingDBProjects = (
    featured.length > 0 ? featured : (dbProjects ?? [])
  ).slice(0, 4);

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
            projects={landingDBProjects}
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
          <Button asChild variant="outline" className="min-h-11 text-sm">
            <Link href="/projects" prefetch={false}>
              Show all projects
            </Link>
          </Button>
        </div>
      </FadeIn>
    </Container>
  );
}
