"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Experience } from "@/config/Experience";
import { ChevronDown, ChevronUp, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            {experience.logo && (
              <div className="bg-muted relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg sm:h-12 sm:w-12">
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors sm:text-lg">
                  {experience.position}
                </h3>
                {experience.isCurrent && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                {experience.companyUrl ? (
                  <Link
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors sm:text-base"
                  >
                    {experience.company}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-sm sm:text-base">
                    {experience.company}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground ml-13 flex-shrink-0 text-left text-xs sm:ml-0 sm:text-right sm:text-sm">
            <div>
              {experience.startDate} - {experience.endDate}
            </div>
            {experience.location && (
              <div className="mt-1 flex items-center gap-1 sm:justify-end">
                <MapPin className="h-3 w-3" />
                <span className="text-[10px] sm:text-xs">
                  {experience.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-0 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Brief Summary - Always Visible */}
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              <span
                dangerouslySetInnerHTML={{ __html: experience.description[0] }}
              />
            </p>
          </div>

          {/* Expandable Details */}
          {isExpanded && experience.description.length > 1 && (
            <div className="prose prose-sm animate-in fade-in slide-in-from-top-2 max-w-none duration-300">
              <ul className="text-muted-foreground space-y-1.5 text-sm sm:space-y-2 sm:text-base">
                {experience.description.slice(1).map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {isExpanded &&
            experience.technologies &&
            experience.technologies.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 flex flex-wrap gap-1.5 duration-300 sm:gap-2">
                {experience.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-[10px] sm:text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

          {/* Expand/Collapse Button */}
          {experience.description.length > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 mt-2 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
