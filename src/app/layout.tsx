import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import Footer from '@/components/common/Footer';
import LazyComponents from '@/components/common/LazyComponents';
import Navbar from '@/components/common/Navbar';
import SearchPalette from '@/components/common/SearchPalette';
import SmoothScroll from '@/components/common/SmoothScroll';
import StructuredData from '@/components/common/StructuredData';
import { ThemeProvider } from '@/components/common/ThemeProviders';
import { Toaster } from '@/components/ui/sonner';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { bricolageGrotesque, geistMono, geistSans } from '@/config/fonts';
import { getSiteSettings } from '@/lib/site-settings';
import { Analytics } from '@vercel/analytics/next';
import { ViewTransitions } from 'next-view-transitions';

import './globals.css';

export const metadata = getMetadata('/');

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Same cached read Footer uses, so this adds no extra DB query.
  const { hero } = await getSiteSettings();

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} font-sans antialiased`}
        >
          <StructuredData />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothScroll>
              <Navbar />
              {children}
              <LazyComponents ownerName={hero.name} />
              <Footer />
              <SearchPalette />
              {/* Renders toast() feedback (admin saves, contact form). */}
              <Toaster richColors closeButton />
              <GoogleAnalytics />
              <UmamiAnalytics />
              <Analytics />
            </SmoothScroll>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
