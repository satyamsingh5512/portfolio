export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/assets/satyam-avatar.png',
    alt: 'logo',
    width: 100,
    height: 100,
  },
  navItems: [
    {
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Experience',
      href: '/work-experience',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
  ] as NavItem[],
};
