import { footerConfig } from "@/config/Footer";
import React from "react";

import Container from "./Container";
import VisitorCount from "./VisitorCount";

export default function Footer() {
  return (
    <Container className="py-10 sm:py-16">
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-secondary text-center text-xs sm:text-sm">
          {footerConfig.text} <b>{footerConfig.developer}</b> <br /> &copy;{" "}
          {new Date().getFullYear()}. {footerConfig.copyright}
        </p>
        <VisitorCount />
      </div>
    </Container>
  );
}
