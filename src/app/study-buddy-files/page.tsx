import Container from "@/components/common/Container";
import { Separator } from "@/components/ui/separator";
import { generateMetadata as getMetadata } from "@/config/Meta";
import {
  downloads,
  installGuides,
  links,
  studyBuddyConfig,
} from "@/config/StudyBuddy";
import { ArrowUpRight, Download, ExternalLink, Link2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  ...getMetadata("/study-buddy-files"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function StudyBuddyFilesPage() {
  return (
    <Container as="main" className="py-10 sm:py-16">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center sm:space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {studyBuddyConfig.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
            {studyBuddyConfig.description}
          </p>
        </div>
        <Separator />

        <div className="space-y-8 sm:space-y-12">
          {/* Downloads */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#736F70] dark:border-white/10">
                <Download className="size-4" />
              </div>
              <h2 className="text-xl font-semibold md:text-2xl">Downloads</h2>
            </div>

            <div className="ml-4 space-y-3 sm:ml-8 md:ml-16 md:space-y-4">
              {downloads.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/50 hover:bg-muted/70 flex w-full flex-col gap-3 rounded-lg border border-black/10 p-3 transition-colors sm:flex-row sm:items-center md:p-4 dark:border-white/10"
                >
                  <Download className="text-muted-foreground size-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <span className="text-sm font-medium">{item.name}</span>
                      <ExternalLink className="text-muted-foreground size-3" />
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
              <p className="text-secondary text-sm">
                Both links open the StudyBuddy files page on GitHub, where the
                .deb and .apk are published.
              </p>
            </div>
          </div>

          {/* Install guides */}
          {installGuides.map((guide) => (
            <div key={guide.id} className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#736F70] dark:border-white/10">
                  {guide.icon}
                </div>
                <h2 className="text-xl font-semibold md:text-2xl">
                  {guide.title}
                </h2>
              </div>

              <ol className="ml-4 space-y-3 sm:ml-8 md:ml-16 md:space-y-4">
                {guide.steps.map((step, index) => (
                  <li key={step.text} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 px-2 py-1 text-[#736F70] dark:border-white/10">
                        <span className="text-secondary text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-secondary text-sm">{step.text}</p>
                    </div>
                    {"code" in step && step.code && (
                      <div className="bg-muted/50 flex w-full items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
                        <code className="text-secondary font-mono text-sm break-all">
                          {step.code}
                        </code>
                      </div>
                    )}
                  </li>
                ))}
                {"note" in guide && guide.note && (
                  <li className="bg-accent/50 rounded-lg border border-black/10 p-3 dark:border-white/10">
                    <p className="text-muted-foreground text-sm">
                      {guide.note}
                    </p>
                  </li>
                )}
              </ol>
            </div>
          ))}

          {/* Links */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#736F70] dark:border-white/10">
                <Link2 className="size-4" />
              </div>
              <h2 className="text-xl font-semibold md:text-2xl">Links</h2>
            </div>

            <div className="ml-4 flex flex-col gap-4 sm:ml-8 md:ml-16">
              {links.map((link) => (
                <h3
                  key={link.name}
                  className="text-secondary flex items-center gap-1 text-sm"
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </Link>
                  <ArrowUpRight className="size-4" />
                </h3>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
