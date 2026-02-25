"use client";

import { githubConfig } from "@/config/Github";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import GithubIcon from "../svgs/Github";
import { Button } from "../ui/button";

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
  // Memoize the entire grid calculation to prevent recalculation on every render
  // Must be called before any early returns to satisfy React hooks rules
  const { weeks, getColor } = useMemo(() => {
    if (contributions.length === 0) {
      return { weeks: [], getColor: () => theme[0] || "#ebedf0" };
    }

    // Create a grid of contributions for the past year
    const today = new Date();
    // Set to end of today in UTC to handle timezone issues
    const todayUTC = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    // Filter contributions to only include dates up to today
    const validContributions = contributions.filter((contrib) => {
      const contribDate = new Date(contrib.date + "T00:00:00.000Z"); // Parse as UTC
      return contribDate <= todayUTC;
    });

    // Find the actual date range from the valid contributions data
    const contributionDates = validContributions.map(
      (c) => new Date(c.date + "T00:00:00.000Z"),
    );
    const minDate =
      contributionDates.length > 0
        ? new Date(Math.min(...contributionDates.map((d) => d.getTime())))
        : new Date();
    const maxDate =
      contributionDates.length > 0
        ? new Date(Math.max(...contributionDates.map((d) => d.getTime())))
        : new Date();

    // Create a map of contributions by date
    const contributionMap = new Map<string, ContributionItem>();
    validContributions.forEach((contrib) => {
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
      const dateString = currentDatePointer.toISOString().split("T")[0];
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

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground text-sm">
          {githubConfig.loadingState.title}
        </div>
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground text-sm">
          No contribution data available
        </div>
      </div>
    );
  }

  const getTooltipText = (contribution: ContributionItem) => {
    const date = new Date(contribution.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const countText =
      contribution.count === 1
        ? "1 contribution"
        : `${contribution.count} contributions`;

    return `${countText} on ${formattedDate}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="mb-2 flex">
          {githubConfig.months.map((month, index) => (
            <div
              key={month}
              className="text-muted-foreground text-xs"
              style={{
                width: `${(weeks.length / 12) * githubConfig.blockSize + githubConfig.blockMargin}px`,
                marginLeft: index === 0 ? "14px" : "0",
              }}
            >
              {index % 3 === 0 ? month : ""}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels */}
          <div className="mr-2 flex flex-col">
            {githubConfig.weekdays.map((day, index) => (
              <div
                key={index}
                className="text-muted-foreground flex items-center justify-end text-xs"
                style={{
                  height: `${githubConfig.blockSize}px`,
                  marginBottom: `${githubConfig.blockMargin}px`,
                  width: "12px",
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
                    className="hover:ring-primary/50 cursor-pointer rounded-sm transition-all hover:ring-2"
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
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-muted-foreground text-xs">Less</span>
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
          <span className="text-muted-foreground text-xs">More</span>
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
          const calendar =
            data.data.user.contributionsCollection.contributionCalendar;
          const weeks = calendar.weeks || [];

          const flattenedContributions = weeks.flatMap((week) =>
            week.contributionDays.map((day) => ({
              date: day.date,
              count: day.contributionCount,
              level: day.contributionLevel,
            })),
          );

          setContributions(flattenedContributions);
          setTotalContributions(calendar.totalContributions || 0);
        } else if (data.contributions && Array.isArray(data.contributions)) {
          // Handle alternative API response format (array of arrays)
          const flattenedContributions = data.contributions.flat();

          // Convert contribution level strings to numbers
          const levelMap: Record<string, number> = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          const validContributions = flattenedContributions
            .filter(
              (item: unknown): item is GitHubContributionResponse =>
                typeof item === "object" &&
                item !== null &&
                "date" in item &&
                "contributionCount" in item &&
                "contributionLevel" in item,
            )
            .map((item: GitHubContributionResponse) => ({
              date: String(item.date),
              count: Number(item.contributionCount || 0),
              level: levelMap[item.contributionLevel] || 0,
            }));

          // Filter to only valid contributions for total count (up to today)
          const today = new Date();
          const todayUTC = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
            999,
          );
          const validContributionsForTotal = validContributions.filter(
            (contrib) => {
              const contribDate = new Date(contrib.date + "T00:00:00.000Z");
              return contribDate <= todayUTC;
            },
          );

          setContributions(validContributions);
          setTotalContributions(
            validContributionsForTotal.reduce(
              (sum, item) => sum + item.count,
              0,
            ),
          );
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch GitHub contributions:", err);
        setError("Failed to load contributions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (error) {
    return (
      <Container className="py-16">
        <FadeIn>
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">
              {githubConfig.errorState.title}
            </h2>
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
        </FadeIn>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-16">
      <FadeIn>
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="mb-2 text-xl font-bold sm:text-2xl">
            {githubConfig.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {githubConfig.subtitle}
          </p>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-4xl overflow-x-auto">
        <FadeIn delay={0.2}>
          <ContributionCalendar
            contributions={contributions}
            isLoading={isLoading}
            theme={
              resolvedTheme === "dark"
                ? githubConfig.theme.dark
                : githubConfig.theme.light
            }
          />
        </FadeIn>

        {!isLoading && totalContributions > 0 && (
          <FadeIn delay={0.4} direction="up" distance={10}>
            <div className="mt-4 text-center sm:mt-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                {githubConfig.totalCountLabel.replace(
                  "{{count}}",
                  totalContributions.toString(),
                )}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-3 text-sm sm:mt-4"
              >
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
          </FadeIn>
        )}
      </div>
    </Container>
  );
}
