'use client';

import { SlidingNav } from '@salman8797/component-library';

import { navItems, type NavId } from '@/content/site';

import { renderNavLink } from './NavLink';

/** The primary links with the sliding pill, wired to Next.js routing. */
export function NavLinks({ active }: { active: NavId }) {
  return (
    <SlidingNav
      items={navItems}
      activeId={active}
      renderLink={renderNavLink}
      persistKey="nav-from"
    />
  );
}
