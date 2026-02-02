"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { ProjectRecord } from "@/lib/supabase";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

import ArrowRight from "../svgs/ArrowRight";
import Github from "../svgs/Github";
import Website from "../svgs/Website";
import { TechnologyIcon } from "../technologies/TechnologyMapper";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface DBProjectCardProps {
  project: ProjectRecord;
}

export function DBProjectCard({ project }: DBProjectCardProps) {
  return (
    <Card className="group h-full w-full overflow-hidden border-gray-100 p-0 shadow-none transition-all dark:border-gray-800">
      <CardHeader className="p-0">
        <div className="group relative aspect-video overflow-hidden">
          {project.image ? (
            <Image
              className="h-full w-full object-cover"
              src={project.image}
              alt={project.title}
              width={1920}
              height={1080}
              loading="lazy"
            />
          ) : (
            <div className="from-primary/20 to-primary/5 flex h-full w-full items-center justify-center bg-linear-to-br">
              <span className="text-primary/30 text-4xl font-bold">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          {project.featured && (
            <Badge className="bg-primary text-primary-foreground absolute top-2 right-2">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Project Header - Title and Icons */}
          <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-4">
            <h3 className="text-base leading-tight font-semibold sm:text-xl">
              {project.title}
            </h3>
            <div className="flex shrink-0 items-center gap-2">
              {project.liveUrl && (
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      className="text-secondary hover:text-primary flex size-5 items-center justify-center transition-colors sm:size-6"
                      href={project.liveUrl}
                      target="_blank"
                    >
                      <Website />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Website</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {project.githubUrl && (
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      className="text-secondary hover:text-primary flex size-5 items-center justify-center transition-colors sm:size-6"
                      href={project.githubUrl}
                      target="_blank"
                    >
                      <Github />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View GitHub</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-secondary line-clamp-3 text-sm sm:text-base">
            {project.shortDescription}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h4 className="text-secondary mb-2 text-xs font-medium sm:text-sm">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies.map((tech, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <TechnologyIcon
                        name={tech}
                        className="size-5 transition-all duration-300 hover:scale-120 hover:cursor-pointer sm:size-6"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tech}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* Status Badge */}
          {project.status && project.status !== "completed" && (
            <Badge
              variant={
                project.status === "in-progress" ? "default" : "secondary"
              }
            >
              {project.status === "in-progress" ? "In Progress" : "Archived"}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-row items-center justify-between px-4 pt-2 pb-4 sm:px-6 sm:pb-6">
        {(project.liveUrl || project.githubUrl) && (
          <Link
            className="text-primary flex items-center gap-1 text-sm hover:underline sm:text-base"
            href={project.liveUrl || project.githubUrl || "#"}
            target="_blank"
          >
            <span>View Project</span>
            <ArrowRight />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

interface DBProjectListProps {
  projects: ProjectRecord[];
  className?: string;
}

export function DBProjectList({ projects, className }: DBProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 ${className}`}
    >
      {projects.map((project) => (
        <DBProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
