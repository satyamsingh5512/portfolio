import Container from "@/components/common/Container";
import { ShortLinkLanding } from "@/components/short-link/ShortLinkLanding";
import { siteConfig } from "@/config/Meta";
import ShortLinkModel, { type ShortLinkKind } from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import { CODE_PATTERN } from "@/lib/short-links";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Codes resolve at request time and every load is counted, so never cache.
export const dynamic = "force-dynamic";

interface ShortLinkPageProps {
  params: Promise<{ code: string }>;
}

interface ResolvedLink {
  code: string;
  url: string;
  kind: ShortLinkKind;
  title?: string;
  description?: string;
  tags: string[];
}

async function resolveLink(code: string): Promise<ResolvedLink | null> {
  if (!CODE_PATTERN.test(code)) return null;

  try {
    await connectToDatabase();
    // Count the visit and hand back the destination in one round trip. For blog
    // codes this single hop *is* the whole journey, so `views` is the metric;
    // `clicks` only ever counts "Go to the link" presses on interstitials.
    const doc = await ShortLinkModel.findOneAndUpdate(
      { code, isActive: true },
      { $inc: { views: 1 }, $set: { lastViewedAt: new Date() } },
      { returnDocument: "after" },
    ).lean();

    if (!doc) return null;

    const link = doc as unknown as {
      code: string;
      url: string;
      kind?: ShortLinkKind;
      title?: string;
      description?: string;
      tags?: string[];
      expiresAt?: Date | null;
    };

    if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
      return null;
    }

    return {
      code: link.code,
      url: link.url,
      kind: link.kind === "blog" ? "blog" : "external",
      title: link.title,
      description: link.description,
      tags: link.tags ?? [],
    };
  } catch (error) {
    console.error("Failed to resolve short link:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ShortLinkPageProps): Promise<Metadata> {
  const { code } = await params;

  return {
    metadataBase: new URL(siteConfig.url),
    title: `Redirecting — ${siteConfig.name}`,
    description: `You followed a short link from ${siteConfig.name}'s portfolio.`,
    // Interstitials should never be indexed; the portfolio pages should.
    robots: { index: false, follow: false },
    alternates: { canonical: `${siteConfig.url}/${code}` },
  };
}

export default async function ShortLinkPage({ params }: ShortLinkPageProps) {
  const { code } = await params;
  const link = await resolveLink(code);

  if (!link) notFound();

  // Blog codes point at our own content — send the visitor straight there.
  // `redirect` throws internally, so it must stay outside resolveLink's catch.
  if (link.kind === "blog") redirect(link.url);

  return (
    <Container className="py-14 sm:py-20">
      <ShortLinkLanding
        code={link.code}
        url={link.url}
        title={link.title}
        description={link.description}
        tags={link.tags}
      />
    </Container>
  );
}
