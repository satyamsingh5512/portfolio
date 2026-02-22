export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771769099/portfolio/assets/q0j3puiqnaelv5wp3jhj.jpg",
    alt: "logo",
    width: 100,
    height: 100,
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
