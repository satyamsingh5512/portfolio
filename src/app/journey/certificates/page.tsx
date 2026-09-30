import CertificatesGallery from "@/components/CertificatesGallery";
import Container from "@/components/common/Container";
import { Separator } from "@/components/ui/separator";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { getSiteCertificates } from "@/lib/content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  ...getMetadata("/journey/certificates"),
  robots: { index: true, follow: true },
};

/** Entries come from /admin → Achievements (config fallback until first edit). */
export default async function CertificatesPage() {
  const certificates = await getSiteCertificates();

  return (
    <Container as="main" className="py-8 md:py-16">
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-3 text-center md:space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Certificates & Achievements
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-base md:text-lg">
            A curated list of my certificates and notable achievements.
          </p>
        </div>
        <Separator />

        <div className="space-y-8 md:space-y-12">
          <CertificatesGallery certificates={certificates} />
        </div>
      </div>
    </Container>
  );
}
