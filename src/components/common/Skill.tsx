import { Link } from 'next-view-transitions';
import React from 'react';

interface SkillProps {
  name: string;
  href: string;
  children: React.ReactNode;
}

const chipClassName =
  'inline-flex items-center text-sm bg-black/5 dark:bg-white/15 border border-dashed dark:border-white/30 border-black/20 py-1 px-2 rounded-md skill-inner-shadow self-end text-black dark:text-white';

export default function Skill({ name, href, children }: SkillProps) {
  const content = (
    <>
      <div className="size-4 flex-shrink-0">{children}</div>
      <p className="ml-1 text-sm font-bold">{name}</p>
    </>
  );

  // The link is optional in /admin; without one, render a plain chip rather
  // than a link that reopens the current page in a new tab.
  if (!href) {
    return <span className={chipClassName}>{content}</span>;
  }

  return (
    <Link href={href} target="_blank" className={chipClassName}>
      {content}
    </Link>
  );
}
