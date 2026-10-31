'use client';

import Link from 'next/link';
import type { SlidingNavLinkProps } from '@salman8797/component-library';

/** SlidingNav `renderLink` adapter for Next.js client-side navigation. */
export function renderNavLink({ href, children, ...props }: SlidingNavLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
