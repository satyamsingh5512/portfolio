'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type Project } from '@/types/project';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React, { useState, useCallback } from 'react';

import ArrowRight from '../svgs/ArrowRight';
import Github from '../svgs/Github';
import PlayCircle from '../svgs/PlayCircle';
import Website from '../svgs/Website';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ProjectCardProps {
  project: Project;
}

function ProjectCardComponent({ project }: ProjectCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  return (
    <Card className="group h-full w-full overflow-hidden transition-all p-0 border-gray-100 dark:border-gray-800 shadow-none">
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
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:backdrop-blur-xs">
                  <button className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:cursor-pointer hover:bg-white/30">
                    <PlayCircle />
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 border-0">
                <div className="aspect-video w-full">
                  <video
                    className="h-full w-full object-cover rounded-lg"
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
          <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
            {project.projectDetailsPageSlug ? (
              <Link href={project.projectDetailsPageSlug}>
                <h3 className="text-base sm:text-xl font-semibold leading-tight group-hover:text-primary hover:cursor-pointer">
                  {project.title}
                </h3>
              </Link>
            ) : (
              <h3 className="text-base sm:text-xl font-semibold leading-tight">
                {project.title}
              </h3>
            )}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="text-secondary flex size-5 sm:size-6 items-center justify-center hover:text-primary transition-colors"
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
                      className="text-secondary flex size-5 sm:size-6 items-center justify-center hover:text-primary transition-colors"
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
          <p className="text-secondary text-sm sm:text-base line-clamp-3">{project.description}</p>

          {/* Technologies */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium mb-2 text-secondary">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.technologies.map((technology, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <div className="size-5 sm:size-6 hover:scale-120 transition-all duration-300 hover:cursor-pointer">
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
        <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
          <div
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] sm:text-xs ${
              project.isWorking
                ? 'border-green-300 bg-green-500/10'
                : 'border-red-300 bg-red-500/10'
            }`}
          >
            {project.isWorking ? (
              <>
                <div className="size-1.5 sm:size-2 rounded-full bg-green-500 animate-pulse" />
                All Systems Operational
              </>
            ) : (
              <>
                <div className="size-1.5 sm:size-2 rounded-full bg-red-500 animate-pulse" />
                Building
              </>
            )}
          </div>
          {project.projectDetailsPageSlug && (
            <Link
              href={project.projectDetailsPageSlug}
              className="text-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:underline underline-offset-4 hover:text-primary transition-colors"
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
