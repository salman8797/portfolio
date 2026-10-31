'use client';

import Link from 'next/link';
import { DownloadIcon, MenuIcon } from 'lucide-react';
import { Button, Drawer, DrawerClose, GithubIcon, LinkedInIcon } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { navItems, site, type NavId } from '@/content/site';

type MobileMenuProps = {
  active: NavId;
  /** Classes for the trigger button (the home nav animates its chrome on scroll). */
  triggerClassName?: string;
};

/** Hamburger + right-hand drawer, matching the design's "Menu drawer open — Mobile" board. */
export function MobileMenu({ active, triggerClassName }: MobileMenuProps) {
  return (
    <Drawer
      title="Menu"
      closeLabel="Close menu"
      trigger={
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            'flex size-11 cursor-pointer items-center justify-center rounded-md border border-border bg-card p-0 text-foreground transition-colors hover:bg-secondary',
            focusRing,
            triggerClassName,
          )}
        >
          <MenuIcon aria-hidden className="size-5" />
        </button>
      }
      footer={
        <>
          <Button asChild fullWidth size="lg" className="h-11 text-label">
            <a href={site.resume}>
              <DownloadIcon aria-hidden />
              Resume
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="h-11 bg-transparent">
              <a href={site.github}>
                <GithubIcon aria-hidden />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="h-11 bg-transparent">
              <a href={site.linkedin}>
                <LinkedInIcon aria-hidden />
                LinkedIn
              </a>
            </Button>
          </div>
          <span className="text-center text-caption text-muted-foreground">
            © {site.year} {site.name}
          </span>
        </>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <DrawerClose asChild>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center justify-between rounded-md text-[15px] leading-[22px] no-underline transition-colors',
                    focusRing,
                    current
                      ? 'rounded-full bg-border/80 px-4 font-semibold text-foreground'
                      : 'pr-3 pl-7 font-medium text-muted-foreground hover:bg-border hover:text-foreground',
                  )}
                >
                  {current ? (
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                  <span
                    className={cn(
                      'font-mono text-mono-sm',
                      current ? 'text-accent-foreground' : 'text-inherit',
                    )}
                  >
                    {item.href}
                  </span>
                </Link>
              </DrawerClose>
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
}
