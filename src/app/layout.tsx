import UmamiAnalytics from "@/components/analytics/UmamiAnalytics";
import Footer from "@/components/common/Footer";
import LazyComponents from "@/components/common/LazyComponents";
import Navbar from "@/components/common/Navbar";
import SearchPalette from "@/components/common/SearchPalette";
import { ThemeProvider } from "@/components/common/ThemeProviders";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { hankenGrotesk } from "@/config/fonts";
import { Analytics } from "@vercel/analytics/next";
import ReactLenis from "lenis/react";
import { ViewTransitions } from "next-view-transitions";

import "./globals.css";

export const metadata = getMetadata("/");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${hankenGrotesk.variable} font-hanken-grotesk antialiased`}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ReactLenis root>
                <Navbar />
                {children}
                <LazyComponents />
                <Footer />
                <SearchPalette />
                <UmamiAnalytics />
                <Analytics />
              </ReactLenis>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
