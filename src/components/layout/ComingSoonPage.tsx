import type { ReactNode } from 'react';
import { BlocksIcon, CodeXmlIcon, FlaskConicalIcon, SparklesIcon } from 'lucide-react';
import { Badge } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { SubpageFooter } from '@/components/layout/SiteFooter';
import { SubpageHeader } from '@/components/nav/SubpageHeader';
import { componentsSidebar, subpages, type NavId, type Subpage } from '@/content/site';

const icons: Record<Subpage['icon'], ReactNode> = {
  flask: <FlaskConicalIcon aria-hidden className="size-[22px]" />,
  blocks: <BlocksIcon aria-hidden className="size-[22px]" />,
  code: <CodeXmlIcon aria-hidden className="size-[22px]" />,
  sparkles: <SparklesIcon aria-hidden className="size-[22px]" />,
};

function PageIntro({ page }: { page: Subpage }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-6 md:pb-8">
      <div className="flex items-center gap-3">
        <span className="text-overline-caps text-primary">
          {page.index} — {page.title}
        </span>
        <span className="hidden rounded-full border border-border bg-card px-2 py-0.5 font-mono text-mono-sm text-muted-foreground md:inline">
          {page.path}
        </span>
      </div>
      <h1 className="m-0 text-h1 text-foreground">{page.title}</h1>
      <p className="m-0 max-w-[640px] text-body-lg text-muted-foreground">{page.lead}</p>
    </div>
  );
}

function ComingSoonPanel({ page, className }: { page: Subpage; className?: string }) {
  return (
    <section
      aria-label="Coming soon"
      className={cn(
        'flex min-h-80 grow flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-12 items-center justify-center rounded-md border border-border bg-popover',
          page.iconTone === 'highlight' ? 'text-highlight' : 'text-primary',
        )}
      >
        {icons[page.icon]}
      </span>
      <div className="flex flex-col items-center gap-1">
        <h2 className="m-0 text-h3 text-foreground">Coming soon</h2>
        <p className="m-0 text-body-sm text-muted-foreground">This page is being designed.</p>
      </div>
      <Badge variant={page.status.tone} dot className="bg-background font-medium">
        {page.status.label}
      </Badge>
    </section>
  );
}

/** Skeleton category list beside the Components page (desktop only). */
function ComponentsSidebar() {
  return (
    <aside
      aria-label="Component categories"
      className="hidden w-60 shrink-0 flex-col gap-8 border-r border-border py-10 pr-6 md:flex"
    >
      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-card pr-2 pl-3 text-body-sm text-muted-foreground">
        <span className="sr-only">Search components (coming soon)</span>
        <span aria-hidden className="grow">
          Search components
        </span>
        <kbd className="rounded-sm border border-border bg-popover px-1.5 font-mono text-mono-sm">⌘K</kbd>
      </div>
      {componentsSidebar.map((group) => (
        <div key={group.label} className="flex flex-col gap-3">
          <span className="text-overline-caps text-muted-foreground">{group.label}</span>
          <div aria-hidden className="flex flex-col gap-1">
            {group.bars.map((w, i) => (
              <div
                key={i}
                className={cn(
                  'flex h-8 items-center rounded-sm px-2.5',
                  group.label === 'Getting started' &&
                    i === 0 &&
                    'bg-accent shadow-[inset_0_0_0_1px_var(--cl-lavender-600)]',
                )}
              >
                <span
                  className={cn(
                    'h-2 rounded-full',
                    group.label === 'Getting started' && i === 0 ? 'bg-primary' : 'bg-popover',
                  )}
                  style={{ width: w }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

/** The "Coming soon" shell shared by Lab, Components, Playground and AI. */
export function ComingSoonPage({ id }: { id: Exclude<NavId, 'home'> }) {
  const page = subpages[id];
  const withSidebar = id === 'components';
  return (
    <>
      <SubpageHeader active={id} />
      {withSidebar ? (
        <div className="mx-auto flex w-full max-w-[1280px] grow gap-12 px-4 md:px-8">
          <ComponentsSidebar />
          <main className="flex min-w-0 grow flex-col gap-8 pt-10 pb-16 md:gap-10">
            <PageIntro page={page} />
            <ComingSoonPanel page={page} className="min-h-90" />
          </main>
        </div>
      ) : (
        <main className="mx-auto flex w-full max-w-[1280px] grow flex-col gap-8 px-4 py-10 md:gap-10 md:px-8 md:py-16">
          <PageIntro page={page} />
          <ComingSoonPanel page={page} />
        </main>
      )}
      <SubpageFooter />
    </>
  );
}
