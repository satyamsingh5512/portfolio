import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const hankenGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/HankenGrotesk-Variable.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/HankenGrotesk-Italic-Variable.ttf",
      style: "italic",
    },
  ],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});
