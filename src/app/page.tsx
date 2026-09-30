import About from "@/components/landing/About";
import Blog from "@/components/landing/Blog";
import CTA from "@/components/landing/CTA";
import Experience from "@/components/landing/Experience";
import Github from "@/components/landing/Github";
import Hero from "@/components/landing/Hero";
import Journey from "@/components/landing/Journey";
import Work from "@/components/landing/Projects";
import Setup from "@/components/landing/Setup";
import { getSiteSettings } from "@/lib/site-settings";
import React from "react";

export default async function page() {
  // CTA is a client component, so its admin-managed content is passed down.
  const { cta, contact } = await getSiteSettings();

  return (
    <main className="min-h-screen overflow-x-hidden py-16">
      <Hero />
      <Experience />
      <Work />
      <About />
      <Github />
      <Blog />
      <CTA
        profileImage={cta.profileImage}
        preText={cta.preText}
        linkText={cta.linkText}
        calLink={cta.calLink}
        emailAddress={contact.email}
      />
      <Setup />
      <Journey />
    </main>
  );
}
