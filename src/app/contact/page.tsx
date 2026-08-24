import Container from "@/components/common/Container";
import ContactForm from "@/components/contact/ContactForm";
import { Separator } from "@/components/ui/separator";
import { contactConfig } from "@/config/Contact";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  ...getMetadata("/contact"),
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

export default function ContactPage() {
  return (
    <Container as="main" className="py-10 sm:py-16">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center sm:space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {contactConfig.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
            {contactConfig.description}
          </p>
        </div>
        <Separator />

        {/* Contact Form */}
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
