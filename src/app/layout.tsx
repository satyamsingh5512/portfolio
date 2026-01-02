import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import ChatBubble from '@/components/common/ChatBubble';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import OnekoCat from '@/components/common/OnekoCat';
import { Quote } from '@/components/common/Quote';
import { ThemeProvider } from '@/components/common/ThemeProviders';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { generateMetadata as getMetadata } from '@/config/Meta';
import ReactLenis from 'lenis/react';
import { ViewTransitions } from 'next-view-transitions';

import './globals.css';

export const metadata = getMetadata('/');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-hanken-grotesk antialiased`}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: false }}>
                <Navbar />
                {children}
                <OnekoCat />
                <Quote />
                <Footer />
                <ChatBubble />
                <UmamiAnalytics />
              </ReactLenis>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
