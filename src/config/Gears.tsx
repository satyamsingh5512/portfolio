import Headphones from "@/components/svgs/devices/Headphones";
import Keyboard from "@/components/svgs/devices/Keyboard";
import Laptop from "@/components/svgs/devices/Laptop";
import Monitor from "@/components/svgs/devices/Monitor";
import Mouse from "@/components/svgs/devices/Mouse";
import Phone from "@/components/svgs/devices/Phone";

export const devices = [
  {
    name: "Your Laptop Model",
    icon: <Laptop className="size-4" />,
  },
  {
    name: "Your Monitor Model",
    icon: <Monitor className="size-4" />,
  },
  {
    name: "Your Keyboard",
    icon: <Keyboard className="size-4" />,
  },
  {
    name: "Your Mouse",
    icon: <Mouse className="size-4" />,
  },
  {
    name: "Your Headphones",
    icon: <Headphones className="size-4" />,
  },
  {
    name: "Your Phone",
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
];

export const software = [
  { name: "VS Code", href: "https://code.visualstudio.com/" },
  { name: "Notion", href: "https://www.notion.so/desktop" },
  { name: "Figma", href: "https://www.figma.com/" },
  { name: "Postman", href: "https://www.postman.com/" },
  { name: "Git", href: "https://git-scm.com/" },
];
