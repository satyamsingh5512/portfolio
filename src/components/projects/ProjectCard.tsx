"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Project } from "@/types/project";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import ArrowRight from "../svgs/ArrowRight";
import Github from "../svgs/Github";
import PlayCircle from "../svgs/PlayCircle";
import Website from "../svgs/Website";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ProjectCardProps {
  project: Project;
}

function ProjectCardComponent({ project }: ProjectCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  return (
    <Card className="group relative h-full w-full overflow-hidden border-gray-100 p-0 shadow-none transition-all dark:border-gray-800">
      {(project.projectDetailsPageSlug || project.link) && (
        <Link
          href={project.projectDetailsPageSlug || project.link || "#"}
          className="absolute inset-0 z-0"
          target={!project.projectDetailsPageSlug ? "_blank" : undefined}
        >
          <span className="sr-only">View {project.title} details</span>
        </Link>
      )}
      <CardHeader className="p-0">
        <div className="group relative aspect-video overflow-hidden">
          <Image
            className="h-full w-full object-cover"
            src={project.image}
            alt={project.title}
            width={1920}
            height={1080}
            loading="lazy"
          />
          {project.video && (
            <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:backdrop-blur-xs">
                  <button className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:cursor-pointer hover:bg-white/30">
                    <PlayCircle />
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent className="w-full max-w-4xl border-0 p-0">
                <div className="aspect-video w-full">
                  <video
                    className="h-full w-full rounded-lg object-cover"
                    src={project.video}
                    autoPlay
                    loop
                    controls
                  />
                </div>
                <DialogTitle className="sr-only">{project.title}</DialogTitle>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Project Header - Title and Icons */}
          <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-4">
            {project.projectDetailsPageSlug ? (
              <Link
                href={project.projectDetailsPageSlug}
                className="relative z-10"
              >
                <h3 className="group-hover:text-primary text-base leading-tight font-semibold hover:cursor-pointer sm:text-xl">
                  {project.title}
                </h3>
              </Link>
            ) : (
              <h3 className="text-base leading-tight font-semibold sm:text-xl">
                {project.title}
              </h3>
            )}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="text-secondary hover:text-primary relative z-10 flex size-5 items-center justify-center transition-colors sm:size-6"
                    href={project.link}
                    target="_blank"
                  >
                    <Website />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Website</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  {project.github && (
                    <Link
                      className="text-secondary hover:text-primary relative z-10 flex size-5 items-center justify-center transition-colors sm:size-6"
                      href={project.github}
                      target="_blank"
                    >
                      <Github />
                    </Link>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>View GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Description */}
          <p className="text-secondary line-clamp-3 text-sm sm:text-base">
            {project.description}
          </p>

          {/* Technologies */}
          <div>
            <h4 className="text-secondary mb-2 text-xs font-medium sm:text-sm">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.technologies.map((technology, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger className="relative z-10">
                    <div className="size-5 transition-all duration-300 hover:scale-120 hover:cursor-pointer sm:size-6">
                      {technology.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{technology.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {project.details && (
        <CardFooter className="flex flex-col items-start justify-between gap-2 p-4 pt-0 sm:flex-row sm:items-center sm:gap-0 sm:p-6">
          <div
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] sm:text-xs ${
              project.isWorking
                ? "border-green-300 bg-green-500/10"
                : "border-red-300 bg-red-500/10"
            }`}
          >
            {project.isWorking ? (
              <>
                <div className="size-1.5 animate-pulse rounded-full bg-green-500 sm:size-2" />
                All Systems Operational
              </>
            ) : (
              <>
                <div className="size-1.5 animate-pulse rounded-full bg-red-500 sm:size-2" />
                Building
              </>
            )}
          </div>
          {project.projectDetailsPageSlug && (
            <Link
              href={project.projectDetailsPageSlug}
              className="text-secondary hover:text-primary relative z-10 flex items-center gap-1 text-xs underline-offset-4 transition-colors hover:underline sm:gap-2 sm:text-sm"
            >
              View Details <ArrowRight className="size-3 sm:size-4" />
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export const ProjectCard = React.memo(ProjectCardComponent);
