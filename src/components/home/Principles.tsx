'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionLabel, usePrefersReducedMotion } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { principles } from '@/content/site';

const totalWords = principles.reduce((n, [title]) => n + title.split(' ').length, 0);

/**
 * "08 — How I work": the headline words light up one by one as the list scrolls
 * through the viewport. On desktop, hovering or focusing a row dims the others.
 */
export function Principles() {
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = listRef.current;
      if (!el) return;
      const vh = window.innerHeight || 800;
      const r = el.getBoundingClientRect();
      setProgress(vh > 1800 ? 1 : Math.max(0, Math.min(1, (vh * 0.7 - r.top) / Math.max(1, r.height))));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const lit = Math.round((reduced ? 1 : progress) * totalWords);
  let wi = 0;

  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-border pt-12 pb-32 lg:pt-16 lg:pb-40">
      <SectionLabel index="08" as="h2" labelId="how-title" className="gutter-l gap-3 md:gap-4">
        How I work
      </SectionLabel>
      <div className="mx-auto max-w-[1280px] px-4 pt-20 md:px-8 lg:pt-32">
        <ol
          ref={listRef}
          className="group/list m-0 ml-auto flex max-w-[880px] list-none flex-col gap-12 p-0 lg:-my-8 lg:gap-0"
        >
          {principles.map(([title, sub], i) => (
            <li
              key={title}
              tabIndex={0}
              className={cn(
                'flex flex-col gap-2 rounded-md transition-opacity duration-200 ease-decelerate motion-reduce:transition-none lg:grid lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-4 lg:py-8',
                focusRing,
                'focus-visible:outline-offset-4',
                // Dim the siblings of the hovered / focused row.
                'lg:pointer-fine:group-has-[li:hover]/list:not-hover:opacity-30 group-has-[li:focus-visible]/list:not-focus-visible:opacity-30',
              )}
            >
              <span className="font-mono text-mono-sm text-primary lg:text-body-sm lg:leading-10 lg:font-medium">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 lg:gap-3">
                <p className="m-0 text-h2 lg:text-h1">
                  {title.split(' ').map((w, k) => {
                    const on = wi++ < lit;
                    return (
                      <span
                        key={k}
                        className={cn(
                          'transition-colors duration-200 ease-standard',
                          on ? 'text-foreground' : 'text-input',
                        )}
                      >
                        {w}{' '}
                      </span>
                    );
                  })}
                </p>
                <p className="m-0 max-w-[560px] text-body text-muted-foreground lg:text-body-lg">{sub}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
