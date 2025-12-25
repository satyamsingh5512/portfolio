import { type Experience } from '@/config/Experience';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            {experience.logo && (
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {experience.position}
                </h3>
                {experience.isCurrent && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {experience.companyUrl ? (
                  <Link
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {experience.company}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-sm sm:text-base text-muted-foreground">{experience.company}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm text-muted-foreground flex-shrink-0 ml-13 sm:ml-0">
            <div>{experience.startDate} - {experience.endDate}</div>
            {experience.location && (
              <div className="flex items-center gap-1 mt-1 sm:justify-end">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] sm:text-xs">{experience.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="prose prose-sm max-w-none">
            <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
              {experience.description.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
          
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {experience.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-[10px] sm:text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}