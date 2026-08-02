"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ExternalLink,
  FolderGit2,
  Link2,
  Mail,
  Milestone,
  Monitor,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { Link } from "next-view-transitions";
import { useCallback, useState } from "react";

interface ExploreItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    label: "Projects",
    href: "/projects",
    description: "Things I have shipped",
    icon: FolderGit2,
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Notes, tutorials and ideas",
    icon: PenLine,
  },
  {
    label: "Experience",
    href: "/work-experience",
    description: "Where I have worked",
    icon: BriefcaseBusiness,
  },
  {
    label: "Journey",
    href: "/journey",
    description: "My story so far",
    icon: Milestone,
  },
  {
    label: "Gears",
    href: "/gears",
    description: "My setup and tools",
    icon: Monitor,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Say hi or work with me",
    icon: Mail,
  },
];

interface ShortLinkLandingProps {
  code: string;
  url: string;
  title?: string;
  description?: string;
  tags: string[];
}

/** Renders `host/path` compactly, trimming a long path in the middle. */
function prettyUrl(raw: string): { host: string; rest: string } {
  try {
    const parsed = new URL(raw);
    const host = parsed.host.replace(/^www\./, "");
    let rest = `${parsed.pathname}${parsed.search}`;
    if (rest === "/") rest = "";
    if (rest.length > 60) rest = `${rest.slice(0, 40)}…${rest.slice(-15)}`;
    return { host, rest };
  } catch {
    return { host: raw, rest: "" };
  }
}

export function ShortLinkLanding({
  code,
  url,
  title,
  description,
  tags,
}: ShortLinkLandingProps) {
  const [going, setGoing] = useState(false);
  const { host, rest } = prettyUrl(url);

  const handleGo = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks (new tab, download, …) behave natively.
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      setGoing(true);

      // Fire-and-forget click count; navigate regardless of the outcome.
      const record = fetch(`/api/short-link/${code}/click`, {
        method: "POST",
        keepalive: true,
      }).catch(() => undefined);

      const timeout = new Promise((resolve) => setTimeout(resolve, 800));
      Promise.race([record, timeout]).finally(() => {
        window.location.href = url;
      });
    },
    [code, url],
  );

  return (
    <div className="space-y-10">
      {/* Destination card */}
      <Card className="border-border/70">
        <CardContent className="space-y-5 py-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <Link2 className="text-primary h-4 w-4" />
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              /{code}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title || "You are being sent to an external link"}
            </h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>

          <div className="bg-muted/50 flex flex-col gap-1 rounded-lg border p-3">
            <span className="text-muted-foreground text-xs tracking-wide uppercase">
              Destination
            </span>
            <span className="font-mono text-sm break-all">
              <span className="font-semibold">{host}</span>
              <span className="text-muted-foreground">{rest}</span>
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a
                href={url}
                onClick={handleGo}
                rel="noopener noreferrer nofollow"
              >
                {going ? "Taking you there…" : "Go to the link"}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              Always check the destination before you continue.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Explore more */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Explore more of Satyam
          </h2>
          <p className="text-muted-foreground text-sm">
            While you are here — have a look around.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {EXPLORE_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="hover:border-primary/50 h-full transition-colors">
                <CardContent className="flex items-center gap-3 py-4">
                  <span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {item.description}
                    </p>
                  </div>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
