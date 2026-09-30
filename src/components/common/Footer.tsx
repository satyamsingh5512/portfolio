import { getSiteSettings } from "@/lib/site-settings";
import React from "react";

import Container from "./Container";
import VisitorCount from "./VisitorCount";

/** Content comes from /admin → Site Settings → Footer. */
export default async function Footer() {
  const { footer } = await getSiteSettings();

  return (
    <Container as="footer" className="py-10 sm:py-16">
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-secondary text-center text-xs sm:text-sm">
          {footer.text} <b>{footer.developer}</b> <br /> &copy;{" "}
          {new Date().getFullYear()}. {footer.copyright}
        </p>
        <VisitorCount />
      </div>
    </Container>
  );
}
