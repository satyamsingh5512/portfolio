"use client";

import { projects } from "@/config/Projects";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { ProjectList } from "../projects/ProjectList";
import { Button } from "../ui/button";

export default function Projects() {
  return (
    <Container className="mt-12 sm:mt-20">
      <FadeIn>
        <SectionHeading subHeading="Featured" heading="Projects" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <ProjectList className="mt-6 sm:mt-8" projects={projects.slice(0, 4)} />
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
