import { LinkedinIcon, MailIcon } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { site } from '@/content/site';

const footLink = cn(
  'rounded-xs text-muted-foreground no-underline transition-colors hover:text-foreground',
  focusRing,
);

/** Single-row footer under the home page. */
export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 pt-4 pb-6 text-caption text-muted-foreground md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:gap-y-2 md:px-8 md:py-5">
        <span>
          © {site.year} {site.name} · {site.location}
        </span>
        <nav aria-label="Footer" className="flex items-center gap-2">
          <a href={site.linkedin} className={cn(footLink, 'inline-flex min-h-11 items-center md:min-h-0')}>
            LinkedIn
          </a>
          <span aria-hidden className="text-input">
            ·
          </span>
          <a href={`mailto:${site.email}`} className={cn(footLink, 'inline-flex min-h-11 items-center md:min-h-0')}>
            Email
          </a>
          <span aria-hidden className="text-input">
            ·
          </span>
          <a href={site.resume} download className={cn(footLink, 'inline-flex min-h-11 items-center md:min-h-0')}>
            Resume
          </a>
        </nav>
      </div>
    </footer>
  );
}

/** Two-row footer for the standard pages. */
export function SubpageFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-start justify-between gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-1">
          <span className="text-h4 text-foreground">{site.name}</span>
          <span className="text-body-sm text-muted-foreground">{site.tagline}</span>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
          <li>
            <a href={`mailto:${site.email}`} className={cn(footLink, 'flex min-h-11 items-center gap-2 text-body-sm')}>
              <MailIcon size={16} />
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.linkedin} className={cn(footLink, 'flex min-h-11 items-center gap-2 text-body-sm')}>
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-x-6 gap-y-2 px-4 pt-4 pb-8 text-caption text-muted-foreground md:px-8">
        <span>
          © {site.year} {site.name}
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-mono-sm">
          <span aria-hidden className="inline-flex gap-[3px]">
            <span className="size-2 rounded-[2px] bg-primary" />
            <span className="size-2 rounded-[2px] bg-highlight" />
            <span className="size-2 rounded-[2px] bg-popover shadow-[inset_0_0_0_1px_var(--input)]" />
          </span>
          Built with my own design system
        </span>
      </div>
    </footer>
  );
}
