export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: "/assets/avatar-96.webp",
    alt: "Satyam",
    width: 96,
    height: 96,
  },
  navItems: [
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Experience",
      href: "/work-experience",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ] as NavItem[],
};
