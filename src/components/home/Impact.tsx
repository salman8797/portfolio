import { CountUp, SectionLabel } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { stats } from '@/content/site';

/** "03 — Impact": five counters that run once when scrolled into view. */
export function Impact() {
  return (
    <section id="impact" aria-labelledby="impact-title" className="py-12 md:py-16">
      <SectionLabel index="03" as="h2" labelId="impact-title" className="gutter-l gap-3 md:gap-4">
        Impact
      </SectionLabel>
      <div className="mx-auto max-w-[1280px] px-4 pt-8 md:px-8 md:pt-10">
        <dl className="m-0 grid grid-cols-2 border-t border-border md:grid-cols-5 md:border-b">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex flex-col-reverse gap-2 border-b border-border py-5 md:gap-3 md:border-b-0 md:px-6 md:py-8',
                // Mobile: 2 columns, the last stat spans both. Desktop: one row with dividers.
                i % 2 === 1 ? 'border-l pl-4' : 'pr-3',
                i === stats.length - 1 && 'col-span-2 border-l-0 pl-0 md:col-span-1',
                i > 0 && 'md:border-l md:pl-6',
                i === 0 && 'md:pl-0',
                i === stats.length - 1 && 'md:pr-0',
              )}
            >
              <dt className="flex flex-wrap items-center gap-1.5 font-mono text-mono-sm tracking-[0.08em] text-muted-foreground uppercase md:gap-2">
                {s.label}
                {s.sample ? (
                  <span className="rounded-full border border-border px-1.5 tracking-normal text-warning normal-case">
                    sample
                  </span>
                ) : null}
              </dt>
              <dd className="m-0 font-mono text-[24px] leading-8 font-medium tracking-[-0.02em] md:text-[36px] md:leading-10 md:tracking-[-0.03em]">
                <CountUp
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.plus ? <span className="text-primary">+</span> : undefined}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
