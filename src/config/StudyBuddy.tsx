import { Smartphone, Terminal } from "lucide-react";

/**
 * Both native builds are hosted on GitHub. These point at the files page for
 * now — once the binaries are uploaded, swap them for direct release-asset
 * URLs, e.g.
 *   https://github.com/satyamsingh5512/StudyBuddy/releases/download/v1.0.0/studybuddy_1.0.0_amd64.deb
 *   https://github.com/satyamsingh5512/StudyBuddy/releases/download/v1.0.0/studybuddy_1.0.0.apk
 */
const GITHUB_FILES_URL = "https://github.com/satyamsingh5512/StudyBuddy/files";

export const studyBuddyConfig = {
  title: "StudyBuddy",
  description:
    "Download StudyBuddy for Linux and Android. Both builds are hosted on GitHub.",
  filesUrl: GITHUB_FILES_URL,
};

export const downloads = [
  {
    name: "StudyBuddy for Linux (.deb)",
    description: "Debian package for Ubuntu, Debian, Pop!_OS, Mint and others.",
    href: GITHUB_FILES_URL,
  },
  {
    name: "StudyBuddy for Android (.apk)",
    description: "Android build, installed by sideloading the .apk.",
    href: GITHUB_FILES_URL,
  },
];

export const installGuides = [
  {
    id: "linux",
    title: "Install on Linux",
    icon: <Terminal className="size-4" />,
    steps: [
      { text: "Download the .deb file from GitHub." },
      {
        text: "Install it from a terminal in the download folder",
        code: "sudo dpkg -i studybuddy_*.deb && sudo apt-get install -f",
      },
      { text: "Open StudyBuddy from your app launcher and sign in." },
    ],
  },
  {
    id: "android",
    title: "Install on Android",
    icon: <Smartphone className="size-4" />,
    steps: [
      { text: "Download the .apk file from GitHub on your phone." },
      {
        text: "Open the file and allow “Install unknown apps” for your browser when asked.",
      },
      { text: "Open StudyBuddy and sign in." },
    ],
    note: "Android shows a warning because the app is not from the Play Store. That's expected for sideloaded apps.",
  },
];

export const links = [
  { name: "Web app", href: "https://sbd.satym.in" },
  {
    name: "GitHub repository",
    href: "https://github.com/satyamsingh5512/StudyBuddy",
  },
  { name: "All files on GitHub", href: GITHUB_FILES_URL },
];
