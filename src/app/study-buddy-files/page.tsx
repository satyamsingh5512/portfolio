import type { Metadata } from "next";

import StudyBuddyFilesClient from "./StudyBuddyFilesClient";

const PATH = "/study-buddy-files";
const TITLE = "StudyBuddy — Download for Linux & Android";
const DESCRIPTION =
  "Download StudyBuddy for Linux (.deb) and Android (.apk). Pick your platform and grab the latest build from GitHub.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "studybuddy",
    "studybuddy download",
    "studybuddy linux",
    "studybuddy android",
    "studybuddy apk",
    "studybuddy deb",
    "satyam singh",
  ].join(", "),
  openGraph: {
    type: "website",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sleek Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: PATH,
  },
};

export default function StudyBuddyFilesPage() {
  return <StudyBuddyFilesClient />;
}
