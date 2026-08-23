import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CP",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
