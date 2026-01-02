'use client';

import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import Container from '../common/Container';
import GithubIcon from '../svgs/Github';
import { Button } from '../ui/button';

type GitHubContributionResponse = {
  date: string;
  contributionCount: number;
  contributionLevel: string;
  color: string;
};

type ContributionItem = {
  date: string;
  count: number;
  level: number;
};

type ContributionWeek = {
  contributionDays: {
    date: string;
    contributionCount: number;
    contributionLevel: number;
  }[];
};

type GitHubResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: ContributionWeek[];
          totalContributions?: number;
        };
      };
    };
  };
  contributions?: GitHubContributionResponse[][];
};

// Contribution Calendar Component
function ContributionCalendar({
  contributions,
  isLoading,
  theme,
}: {
  contributions: ContributionItem[];
  isLoading: boolean;
  theme: string[];
}) {
  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-sm text-muted-foreground">
          {githubConfig.loadingState.title}
        </div>
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-sm text-muted-foreground">
          No contribution data available
        </div>
      </div>
    );
  }

  // Memoize the entire grid calculation to prevent recalculation on every render
  const { weeks, getColor } = useMemo(() => {
    // Create a grid of contributions for the past year
    const today = new Date();
    // Set to end of today in UTC to handle timezone issues
    const todayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    // Filter contributions to only include dates up to today
    const validContributions = contributions.filter(contrib => {
      const contribDate = new Date(contrib.date + 'T00:00:00.000Z'); // Parse as UTC
      return contribDate <= todayUTC;
    });

    // Find the actual date range from the valid contributions data
    const contributionDates = validContributions.map(c => new Date(c.date + 'T00:00:00.000Z'));
    const minDate = contributionDates.length > 0 ? new Date(Math.min(...contributionDates.map(d => d.getTime()))) : new Date();
    const maxDate = contributionDates.length > 0 ? new Date(Math.max(...contributionDates.map(d => d.getTime()))) : new Date();

    // Create a map of contributions by date
    const contributionMap = new Map<string, ContributionItem>();
    validContributions.forEach(contrib => {
      contributionMap.set(contrib.date, contrib);
    });

    // Use the actual data range, but limit to valid dates only
    const startDate = new Date(minDate);
    const endDate = new Date(Math.min(todayUTC.getTime(), maxDate.getTime()));
    
    // Adjust start date to the beginning of the week (Sunday)
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek !== 0) {
      startDate.setDate(startDate.getDate() - dayOfWeek);
    }

    // Create weeks array
    const weeksArray: ContributionItem[][] = [];
    let currentWeek: ContributionItem[] = [];

    const currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      const dateString = currentDatePointer.toISOString().split('T')[0];
      const contribution = contributionMap.get(dateString) || {
        date: dateString,
        count: 0,
        level: 0,
      };

      currentWeek.push(contribution);

      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }

      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    // Add remaining days if any
    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }

    const getColorFn = (level: number) => {
      const index = Math.min(level, theme.length - 1);
      return theme[index] || theme[0];
    };

    return { weeks: weeksArray, getColor: getColorFn };
  }, [contributions, theme]);

  const getTooltipText = (contribution: ContributionItem) => {
    const date = new Date(contribution.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    const countText = contribution.count === 1 
      ? '1 contribution' 
      : `${contribution.count} contributions`;
    
    return `${countText} on ${formattedDate}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex mb-2">
          {githubConfig.months.map((month, index) => (
            <div
              key={month}
              className="text-xs text-muted-foreground"
              style={{
                width: `${(weeks.length / 12) * githubConfig.blockSize + githubConfig.blockMargin}px`,
                marginLeft: index === 0 ? '14px' : '0',
              }}
            >
              {index % 3 === 0 ? month : ''}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels */}
          <div className="flex flex-col mr-2">
            {githubConfig.weekdays.map((day, index) => (
              <div
                key={index}
                className="text-xs text-muted-foreground flex items-center justify-end"
                style={{
                  height: `${githubConfig.blockSize}px`,
                  marginBottom: `${githubConfig.blockMargin}px`,
                  width: '12px',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((contribution, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    style={{
                      width: `${githubConfig.blockSize}px`,
                      height: `${githubConfig.blockSize}px`,
                      backgroundColor: getColor(contribution.level),
                    }}
                    title={getTooltipText(contribution)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end mt-4 gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            {theme.map((color, index) => (
              <div
                key={index}
                className="rounded-sm"
                style={{
                  width: `${githubConfig.blockSize}px`,
                  height: `${githubConfig.blockSize}px`,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}

export default function Github() {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(
          `${githubConfig.apiUrl}/${githubConfig.username}.json`,
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GitHubResponse = await response.json();

        if (data.data?.user?.contributionsCollection?.contributionCalendar) {
          // Handle GraphQL API response
          const calendar = data.data.user.contributionsCollection.contributionCalendar;
          const weeks = calendar.weeks || [];
          
          const flattenedContributions = weeks.flatMap(week => 
            week.contributionDays.map(day => ({
              date: day.date,
              count: day.contributionCount,
              level: day.contributionLevel,
            }))
          );

          setContributions(flattenedContributions);
          setTotalContributions(calendar.totalContributions || 0);
        } else if (data.contributions && Array.isArray(data.contributions)) {
          // Handle alternative API response format (array of arrays)
          const flattenedContributions = data.contributions.flat();
          
          // Convert contribution level strings to numbers
          const levelMap: Record<string, number> = {
            'NONE': 0,
            'FIRST_QUARTILE': 1,
            'SECOND_QUARTILE': 2,
            'THIRD_QUARTILE': 3,
            'FOURTH_QUARTILE': 4,
          };
          
          const validContributions = flattenedContributions
            .filter(
              (item: unknown): item is GitHubContributionResponse =>
                typeof item === 'object' &&
                item !== null &&
                'date' in item &&
                'contributionCount' in item &&
                'contributionLevel' in item,
            )
            .map((item: GitHubContributionResponse) => ({
              date: String(item.date),
              count: Number(item.contributionCount || 0),
              level: levelMap[item.contributionLevel] || 0,
            }));

          // Filter to only valid contributions for total count (up to today)
          const today = new Date();
          const todayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
          const validContributionsForTotal = validContributions.filter(contrib => {
            const contribDate = new Date(contrib.date + 'T00:00:00.000Z');
            return contribDate <= todayUTC;
          });

          setContributions(validContributions);
          setTotalContributions(
            validContributionsForTotal.reduce((sum, item) => sum + item.count, 0),
          );
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch GitHub contributions:', err);
        setError('Failed to load contributions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{githubConfig.errorState.title}</h2>
          <p className="text-muted-foreground mb-6">
            {githubConfig.errorState.description}
          </p>
          <Button asChild>
            <Link
              href={`https://github.com/${githubConfig.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <GithubIcon className="size-4" />
              {githubConfig.errorState.buttonText}
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-16">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{githubConfig.title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{githubConfig.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <ContributionCalendar
          contributions={contributions}
          isLoading={isLoading}
          theme={resolvedTheme === 'dark' ? githubConfig.theme.dark : githubConfig.theme.light}
        />
        
        {!isLoading && totalContributions > 0 && (
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {githubConfig.totalCountLabel.replace('{{count}}', totalContributions.toString())}
            </p>
            <Button asChild variant="outline" className="mt-3 sm:mt-4 text-sm">
              <Link
                href={`https://github.com/${githubConfig.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="size-4" />
                View on GitHub
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}