"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = "G-ZE4NNL98WC";
const INTERACTION_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

/**
 * gtag.js is ~485 KB of parsed JavaScript and the single heaviest thing on the
 * page. It is loaded on the visitor's first interaction instead of during page
 * load, which keeps it entirely off the critical path.
 *
 * Trade-off: a visitor who leaves without scrolling, tapping or typing is not
 * counted in GA. Umami and Vercel Analytics still record that pageview, so no
 * traffic goes unmeasured.
 */
export default function GoogleAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const load = () => setShouldLoad(true);

    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, load, { once: true, passive: true });
    }

    return () => {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, load);
      }
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
