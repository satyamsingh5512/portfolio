"use client";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  FolderGit2,
  Home,
  Mail,
  PenLine,
  SearchX,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";

interface SuggestedLink {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUGGESTED_LINKS: SuggestedLink[] = [
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
    label: "Contact",
    href: "/contact",
    description: "Say hi or work with me",
    icon: Mail,
  },
];

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="min-h-screen py-16">
      <Container className="py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="space-y-5">
            <span className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-full">
              <SearchX className="text-primary h-5 w-5" aria-hidden="true" />
            </span>

            <div className="space-y-3">
              <p className="text-secondary text-xs font-medium tracking-wider uppercase sm:text-sm">
                Error 404
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                This page does not exist
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                The link may be broken, or the page might have been moved or
                renamed. Nothing you did wrong.
              </p>
            </div>

            {pathname && (
              <div className="bg-muted/50 flex flex-col gap-1 rounded-lg border p-3">
                <span className="text-muted-foreground text-xs tracking-wide uppercase">
                  Requested path
                </span>
                <span className="font-mono text-sm break-all">{pathname}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Back to home
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Go back
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Try one of these instead
              </h2>
              <p className="text-muted-foreground text-sm">
                Or press{" "}
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">
                  K
                </kbd>{" "}
                to search the site.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SUGGESTED_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className="group">
                  <Card className="hover:border-primary/50 h-full transition-colors">
                    <CardContent className="flex items-center gap-3 py-4">
                      <span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {item.description}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors"
                        aria-hidden="true"
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
