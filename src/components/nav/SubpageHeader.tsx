import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';
import { Button, GithubIcon, LinkedinIcon } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { site, type NavId } from '@/content/site';

import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';

const iconLink = cn(
  'flex size-10 items-center justify-center rounded-md text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-foreground',
  focusRing,
);

/** "SS" tile used by the standard (non-home) header. */
function MonogramTile() {
  return (
    <span className="flex size-8 items-center justify-center rounded-md border border-input bg-card font-mono text-body-sm font-semibold tracking-[-0.02em] text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
      SS
    </span>
  );
}

/** Standard 64px header for Lab, Components, Playground and AI. */
export function SubpageHeader({ active }: { active: NavId }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-6 pr-3 pl-4 md:px-8 lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className={cn(
            'flex items-center gap-2.5 justify-self-start rounded-md text-foreground no-underline lg:gap-3',
            focusRing,
          )}
        >
          <MonogramTile />
          <span className="text-label font-semibold">{site.name}</span>
        </Link>
        <div className="hidden lg:block">
          <NavLinks active={active} />
        </div>
        <div className="hidden items-center gap-2 justify-self-end lg:flex">
          <a href={site.github} aria-label="GitHub profile" className={iconLink}>
            <GithubIcon size={18} />
          </a>
          <a href={site.linkedin} aria-label="LinkedIn profile" className={iconLink}>
            <LinkedinIcon size={18} />
          </a>
          <span aria-hidden className="mx-1 h-5 w-px bg-border" />
          <Button asChild className="h-10">
            <a href={site.resume}>
              <DownloadIcon aria-hidden />
              Resume
            </a>
          </Button>
        </div>
        <div className="lg:hidden">
          <MobileMenu active={active} />
        </div>
      </nav>
    </header>
  );
}
