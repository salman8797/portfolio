'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, SectionLabel, StatusDot, usePrefersReducedMotion } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { Texture } from '@/components/textures/Texture';
import { career, careerYears } from '@/content/site';

const EASE = 'cubic-bezier(0.2,0,0,1)';

type Geometry = { fill: number; railH: number; revealed: boolean[]; yearTops: number[]; yShift: number };

/**
 * "06 — Career journey": a dotted rail that fills as you scroll, alternating cards
 * that rise in as they enter, and large outlined years drifting behind (desktop).
 */
export function CareerJourney() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry>({
    fill: 0,
    railH: 0,
    revealed: career.map(() => false),
    yearTops: [0, 300, 600, 900],
    yShift: 0,
  });

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const root = rootRef.current;
      const rail = railRef.current;
      if (!root || !rail) return;
      const vh = window.innerHeight || 800;
      const rr = rail.getBoundingClientRect();
      const rootR = root.getBoundingClientRect();
      const rows = rowRefs.current.map((el) => el?.getBoundingClientRect() ?? null);
      const yearTops = rows.slice(0, 4).map((r) => (r ? r.top - rr.top - 20 : 0));
      const desktop = window.matchMedia('(min-width: 64rem)').matches;
      const fill = Math.max(0, Math.min(rr.height, vh / 2 - rr.top));
      setGeo({
        // Snap to the 8px dash rhythm so the lit rail ends on a whole dash.
        fill: Math.floor(fill / 8) * 8 + 3,
        railH: rr.height,
        revealed: rows.map((r) => !!r && r.top < vh * 0.85),
        yearTops,
        yShift: desktop
          ? Math.max(-300, Math.min(300, (vh / 2 - (rootR.top + rootR.height / 2)) * 0.5))
          : 0,
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, []);

  const allOn = reduced;
  const fill = allOn ? geo.railH : geo.fill;

  return (
    <section
      id="career"
      ref={rootRef}
      aria-labelledby="career-title"
      className="relative overflow-hidden border-t border-border bg-background pt-12 pb-24 lg:pt-16 lg:pb-32"
    >
      <SectionLabel index="06" className="gutter-l relative z-[2] gap-3 md:gap-4">
        Career journey
      </SectionLabel>

      <div className="relative z-[2] mx-auto flex max-w-[1280px] flex-col items-start gap-3 px-4 pt-8 pb-10 text-left lg:items-center lg:px-8 lg:pt-12 lg:pb-[72px] lg:text-center">
        <h2 id="career-title" className="m-0 text-h2 font-bold tracking-[-0.02em] lg:text-h1">
          From developer to UI Lead
        </h2>
        <p className="m-0 max-w-[560px] text-body text-muted-foreground lg:text-body-lg">
          Four companies and 7.8+ years: from shipping frontend modules to setting the standards a whole UI
          team builds on.
        </p>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative">
          {/* Outlined years, drifting with scroll (desktop only). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
            style={{ transform: `translateY(${reduced ? 0 : Math.round(geo.yShift)}px)` }}
          >
            {careerYears.map((y, i) => (
              <span
                key={y}
                className="text-outline absolute left-1/2 -translate-x-1/2 text-[240px] leading-[200px] font-bold tracking-[-0.05em] whitespace-nowrap"
                style={{ top: Math.round(geo.yearTops[i] ?? i * 300) }}
              >
                {y}
              </span>
            ))}
          </div>

          {/* Dotted rail; the lit part tracks scroll. */}
          <div
            ref={railRef}
            aria-hidden
            className="absolute top-0 bottom-0 left-[14px] z-[1] -ml-px w-[3px] overflow-hidden lg:left-1/2"
            style={{
              backgroundImage: 'linear-gradient(to bottom, var(--cl-border-700) 0, var(--cl-border-700) 3px, transparent 3px)',
              backgroundSize: '3px 8px',
            }}
          >
            <div
              className="w-[3px]"
              style={{
                height: fill,
                transition: reduced ? 'none' : 'height 120ms linear',
                backgroundImage: 'linear-gradient(to bottom, var(--foreground) 0, var(--foreground) 3px, transparent 3px)',
                backgroundSize: '3px 8px',
              }}
            />
          </div>

          <ol className="relative z-[2] m-0 flex list-none flex-col gap-5 p-0 lg:gap-10">
            {career.map((e, i) => {
              const right = i % 2 === 1;
              const on = allOn || geo.revealed[i];
              const delay = reduced ? 0 : right ? 120 : 0;
              return (
                <li
                  key={e.co}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="grid grid-cols-[28px_minmax(0,1fr)] items-start lg:grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)]"
                >
                  {/* Node: connector line + diamond (+ pulse on the final row). */}
                  <div className="relative col-start-1 row-start-1 h-px lg:col-start-2">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-7 left-[14px] h-px w-[14px] lg:top-10 lg:w-9',
                        right ? 'lg:left-[60px]' : 'lg:left-0',
                      )}
                      style={{
                        background: on ? 'var(--input)' : 'var(--border)',
                        transition: reduced ? 'none' : `background-color 320ms ${EASE}`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute top-[22px] left-[14px] -ml-1.5 size-3 lg:top-[34px] lg:left-1/2"
                      style={{
                        background: on ? (e.final ? 'var(--primary)' : 'var(--foreground)') : 'var(--cl-border-700)',
                        boxShadow: '0 0 0 4px var(--background)',
                        transform: `rotate(45deg) scale(${on ? 1 : 0.55})`,
                        transition: reduced ? 'none' : `transform 320ms ${EASE}, background-color 320ms ${EASE}`,
                      }}
                    />
                    {e.final ? (
                      <StatusDot
                        pulse
                        className="absolute top-[25px] left-[14px] ml-3 lg:top-[37px] lg:left-1/2"
                        style={{ opacity: on ? 1 : 0 }}
                      />
                    ) : null}
                  </div>

                  <article
                    aria-hidden={!on || undefined}
                    className={cn(
                      'relative col-start-2 row-start-1 w-full max-w-[600px] overflow-hidden rounded-lg border bg-card lg:max-w-[520px]',
                      right ? 'lg:col-start-3 lg:justify-self-start' : 'lg:col-start-1 lg:justify-self-end',
                    )}
                    style={{
                      borderColor: e.final && on ? 'var(--cl-lavender-600)' : 'var(--border)',
                      boxShadow:
                        e.final && on
                          ? '0 0 0 1px var(--cl-lavender-600), 0 24px 64px -24px color-mix(in srgb, var(--primary) 45%, transparent)'
                          : 'none',
                      opacity: on ? 1 : 0,
                      transform: `translateY(${on ? 0 : 32}px)`,
                      transition: reduced
                        ? 'none'
                        : `opacity 560ms ${EASE} ${delay}ms, transform 560ms ${EASE} ${delay}ms, border-color 320ms ${EASE}, box-shadow 480ms ${EASE}`,
                    }}
                  >
                    <Texture kind="ditherRamp" className="inset-x-0 bottom-0 h-[72%] bg-cl-border-500 opacity-40" />
                    <div className="relative z-[1] flex flex-col gap-3 p-5 lg:p-8">
                      <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 font-mono text-mono-sm tracking-[0.08em]">
                        <span className="text-primary">{e.date}</span>
                        <span className="text-input">·</span>
                        <span className="text-muted-foreground">{e.co}</span>
                      </p>
                      <h3 className="m-0 text-h3 tracking-[-0.01em] lg:text-h2">{e.role}</h3>
                      {e.wins.length > 0 ? (
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                          {e.wins.map((w) => (
                            <li key={w} className="grid grid-cols-[12px_minmax(0,1fr)] gap-2 text-body text-muted-foreground">
                              <span aria-hidden className="mt-[9px] size-1 bg-cl-border-400" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {e.final ? (
                        <>
                          <p className="m-0 text-body-lg text-foreground">
                            “Open to Full Stack (frontend-heavy) and UI Lead roles. Available to start immediately.”
                          </p>
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                            <Button asChild size="lg" className="h-11 px-5 text-label">
                              <a href="#contact">
                                Let’s talk<span aria-hidden>→</span>
                              </a>
                            </Button>
                            <span className="inline-flex items-center gap-2 font-mono text-mono-sm tracking-[0.08em] text-success">
                              <StatusDot pulse />
                              AVAILABLE NOW
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
