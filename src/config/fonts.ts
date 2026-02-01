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
