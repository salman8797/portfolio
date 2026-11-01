'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge, SectionLabel, usePrefersReducedMotion } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { Texture } from '@/components/textures/Texture';
import { cases } from '@/content/site';

import { ArrowLink } from './ArrowLink';

const H = 480;
const TOPS = [112, 136, 160];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Placeholder "screenshot": a token-coloured app-window sketch with grain. */
function ShotPlaceholder({ i, label, className, style }: { i: number; label: string; className?: string; style?: React.CSSProperties }) {
  const bars = [
    [72, 48, 88, 60],
    [56, 92, 40, 76],
    [84, 64, 52, 96],
  ][i % 3];
  return (
    <div role="img" aria-label={label} className={cn('relative overflow-hidden bg-background', className)} style={style}>
      <Texture kind="ditherField" fade="down" className="inset-0 bg-cl-border-600 opacity-50" />
      <div aria-hidden className="relative flex h-full flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-cl-border-700" />
          <span className="size-2 rounded-full bg-cl-border-700" />
          <span className="size-2 rounded-full bg-cl-border-700" />
          <span className="ml-3 h-2 w-32 rounded-full bg-popover" />
        </div>
        <div className="grid grow grid-cols-[96px_1fr] gap-3">
          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
            {bars.map((w, k) => (
              <span key={k} className={cn('h-2 rounded-full', k === 0 ? 'bg-primary' : 'bg-popover')} style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((k) => (
                <div key={k} className="flex h-16 flex-col justify-end gap-1.5 rounded-md border border-border bg-card p-3">
                  <span className="h-1.5 w-1/2 rounded-full bg-popover" />
                  <span className={cn('h-3 w-3/4 rounded-full', k === i ? 'bg-highlight' : 'bg-cl-border-600')} />
                </div>
              ))}
            </div>
            <div className="relative grow rounded-md border border-border bg-card">
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute inset-x-3 bottom-3 h-2/3 w-[calc(100%-24px)]">
                <path
                  d={['M0 50 C40 20 70 45 100 30 S160 10 200 18', 'M0 40 C30 44 60 12 100 22 S170 50 200 14', 'M0 30 C40 50 80 10 120 26 S180 34 200 8'][i % 3]}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "07 — Selected work". Desktop: sticky cards that stack; the ones behind shrink and dim,
 * and each screenshot drifts slightly. Mobile: a plain list.
 */
export function CaseStack() {
  const reduced = usePrefersReducedMotion();
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [depth, setDepth] = useState([0, 0, 0]);
  const [ys, setYs] = useState([0, 0, 0]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight || 800;
      const still = vh > 1800 || !window.matchMedia('(min-width: 64rem)').matches;
      if (still) {
        setDepth([0, 0, 0]);
        setYs([0, 0, 0]);
        return;
      }
      const els = refs.current;
      const p = [0, 1].map((i) => {
        const next = els[i + 1];
        if (!next) return 0;
        return clamp((TOPS[i] + H - next.getBoundingClientRect().top) / (H - 24), 0, 1);
      });
      setDepth([p[0] + p[1], p[1], 0]);
      setYs(
        [0, 1, 2].map((i) => {
          const el = els[i];
          if (!el) return 0;
          const r = el.getBoundingClientRect();
          return clamp((vh * 0.5 - (r.top + H / 2)) * 0.06, -24, 24);
        }),
      );
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

  const d = reduced ? [0, 0, 0] : depth;
  const y = reduced ? [0, 0, 0] : ys;
  const total = String(cases.length).padStart(2, '0');

  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-border pt-12 pb-24 lg:pt-16">
      <SectionLabel index="07" className="gutter-l gap-3 md:gap-4">
        Selected work
      </SectionLabel>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 pt-8 md:px-8 lg:gap-14 lg:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 id="work-title" className="m-0 mb-2 text-h2 lg:mb-0 lg:text-h1">
            Featured case studies
          </h2>
          <ArrowLink href="/lab" className="hidden lg:inline-flex">
            See the Lab
          </ArrowLink>
        </div>

        {/* Mobile / tablet list */}
        <div className="flex flex-col gap-4 lg:hidden">
          {cases.map((c, i) => (
            <article key={c.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
              <ShotPlaceholder i={i} label={`Placeholder screenshot for case study ${i + 1}`} className="h-[200px] border-b border-border" />
              <div className="flex flex-col gap-3 p-5">
                <span className="font-mono text-mono-sm tracking-[0.12em] text-primary">
                  CASE {String(i + 1).padStart(2, '0')} / {total} · {c.domain.toUpperCase()}
                </span>
                <h3 className="m-0 text-h3">{c.title}</h3>
                <p className="m-0 text-body-sm text-muted-foreground">{c.summary}</p>
                <ArrowLink href={`#${c.id}`} className="self-start">
                  Read case study
                </ArrowLink>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop sticky stack */}
        <div className="relative hidden flex-col gap-8 lg:flex">
          <div
            aria-hidden
            className="absolute -top-6 right-[-24px] left-12 z-0 h-[456px] rotate-[1.5deg] overflow-hidden rounded-xl border border-border bg-card opacity-50"
          >
            <Texture kind="chevrons" fade="none" className="inset-0 bg-cl-border-500" />
          </div>
          {cases.map((c, i) => (
            <article
              key={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="sticky box-border grid h-[480px] origin-top grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-popover"
              style={{ top: TOPS[i], zIndex: i + 1, transform: `scale(${(1 - 0.04 * d[i]).toFixed(4)})` }}
            >
              <div className="flex flex-col gap-4">
                <span className="font-mono text-mono-sm tracking-[0.12em] text-primary">
                  CASE {String(i + 1).padStart(2, '0')} / {total}
                </span>
                <Badge variant="outline" className="border-border font-medium text-muted-foreground">
                  {c.domain}
                </Badge>
                <h3 className="m-0 text-h2">{c.title}</h3>
                <p className="m-0 text-body text-muted-foreground">{c.summary}</p>
                <dl className="m-0 mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-border pt-4 font-mono text-mono-sm">
                  <dt className="text-muted-foreground">ROLE</dt>
                  <dd className="m-0">{c.role}</dd>
                  <dt className="text-muted-foreground">YEAR</dt>
                  <dd className="m-0">{c.year}</dd>
                </dl>
                <ArrowLink href={`#${c.id}`} className="self-start">
                  Read case study
                </ArrowLink>
              </div>
              <div className="relative overflow-hidden rounded-lg border border-border">
                <ShotPlaceholder
                  i={i}
                  label={`Placeholder screenshot for case study ${i + 1}`}
                  className="absolute inset-x-0 -top-6 h-[calc(100%+48px)]"
                  style={{ transform: `translateY(${y[i].toFixed(1)}px)` }}
                />
              </div>
              {i < cases.length - 1 ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-background"
                  style={{ opacity: Math.min(0.6, 0.3 * d[i]) }}
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
