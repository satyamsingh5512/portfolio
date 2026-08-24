import { catConfig } from "@/config/Cat";
import Script from "next/script";
import React from "react";

export default function OnekoCat() {
  if (!catConfig.enabled) {
    return null;
  }

  // Absolute path: a relative "./oneko/oneko.js" 404s on any nested route.
  return (
    <Script
      src="/oneko/oneko.js"
      strategy="lazyOnload"
      data-cat="https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768645/portfolio/oneko/file.gif"
    />
  );
}
