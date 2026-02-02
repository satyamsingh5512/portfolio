import Headphones from "@/components/svgs/devices/Headphones";
import Keyboard from "@/components/svgs/devices/Keyboard";
import Laptop from "@/components/svgs/devices/Laptop";
import Monitor from "@/components/svgs/devices/Monitor";
import Mouse from "@/components/svgs/devices/Mouse";
import Phone from "@/components/svgs/devices/Phone";

export const devices = [
  {
    name: "MacBook Pro M3 (16GB RAM, 512GB SSD)",
    icon: <Laptop className="size-4" />,
  },
  {
    name: "Samsung S32R652 24-inch Monitor",
    icon: <Monitor className="size-4" />,
  },
  {
    name: "Redragon K630 Dragonborn Mechanical Keyboard",
    icon: <Keyboard className="size-4" />,
  },
  {
    name: "Logitech G502 Hero Gaming Mouse",
    icon: <Mouse className="size-4" />,
  },
  {
    name: "Realme Buds Air 7 Wireless Earbuds",
    icon: <Headphones className="size-4" />,
  },
  {
    name: "Mi 11X (Alioth)",
    icon: <Phone className="size-4" />,
  },
];

export const webExtensions = [
  { name: "uBlock Origin", href: "https://ublockorigin.com/" },
  {
    name: "React Developer Tools",
    href: "https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en",
  },
  { name: "Wappalyzer", href: "https://www.wappalyzer.com/" },
  {
    name: "ColorZilla",
    href: "https://chromewebstore.google.com/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp?hl=en",
  },
  { name: "Grammarly", href: "https://www.grammarly.com/" },
  {
    name: "JSON Viewer",
    href: "https://chromewebstore.google.com/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=en",
  },
  {
    name: "Vimium",
    href: "https://chromewebstore.google.com/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en",
  },
  {
    name: "Refined GitHub",
    href: "https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf?hl=en",
  },
  {
    name: "OctoLinker",
    href: "https://chromewebstore.google.com/detail/octolinker/jlmafbaeoofdegohdhinkhilhclaklkp?hl=en",
  },
  {
    name: "GitHub File Icons",
    href: "https://chromewebstore.google.com/detail/github-file-icons/jpfjacgjehbnbkcmdmpccgmphddpidck?hl=en",
  },
];

export const software = [
  { name: "VS Code", href: "https://code.visualstudio.com/" },
  {
    name: "Docker Desktop",
    href: "https://www.docker.com/products/docker-desktop/",
  },
  { name: "Postman", href: "https://www.postman.com/" },
  { name: "Insomnia", href: "https://insomnia.rest/" },
  { name: "Git", href: "https://git-scm.com/" },
  { name: "GitHub Desktop", href: "https://desktop.github.com/" },
  { name: "DBeaver", href: "https://dbeaver.io/" },
  { name: "Figma", href: "https://www.figma.com/" },
  { name: "Notion", href: "https://www.notion.so/desktop" },
  { name: "Warp Terminal", href: "https://www.warp.dev/" },
  { name: "TablePlus", href: "https://tableplus.com/" },
  { name: "Vercel CLI", href: "https://vercel.com/docs/cli" },
  { name: "Supabase CLI", href: "https://supabase.com/docs/guides/cli" },
  { name: "Linear", href: "https://linear.app/" },
  { name: "Raycast", href: "https://www.raycast.com/" },
];
