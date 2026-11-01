import type { ComponentProps } from 'react';
import Link from 'next/link';
import { cn, focusRing } from '@salman8797/component-library/utils';

/** Text link with a trailing arrow that nudges right on hover ("Contact me →"). */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'group inline-flex min-h-11 items-center gap-2 rounded-sm text-label font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent-foreground',
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 ease-standard group-hover:translate-x-[3px] motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}
