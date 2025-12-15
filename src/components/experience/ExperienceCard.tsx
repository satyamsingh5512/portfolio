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
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {experience.logo && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {experience.position}
                </h3>
                {experience.isCurrent && (
                  <Badge variant="secondary" className="text-xs">
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
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {experience.company}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{experience.company}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground flex-shrink-0">
            <div>{experience.startDate} - {experience.endDate}</div>
            {experience.location && (
              <div className="flex items-center gap-1 mt-1 justify-end">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{experience.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <ul className="space-y-2 text-muted-foreground">
              {experience.description.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
          
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
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