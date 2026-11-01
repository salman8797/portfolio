import { SectionLabel, StatusDot } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { Texture } from '@/components/textures/Texture';
import { companies, site } from '@/content/site';

// 7-row dot-matrix glyphs for the company wordmarks (stand-ins until real logos exist).
const GLYPHS: Record<string, string[]> = {
  A: ['.####.', '######', '##..##', '##..##', '######', '##..##', '##..##'],
  D: ['#####.', '######', '##..##', '##..##', '##..##', '######', '#####.'],
  E: ['######', '######', '##....', '#####.', '##....', '######', '######'],
  F: ['######', '######', '##....', '#####.', '##....', '##....', '##....'],
  H: ['##..##', '##..##', '##..##', '######', '######', '##..##', '##..##'],
  I: ['##', '##', '##', '##', '##', '##', '##'],
  L: ['##....', '##....', '##....', '##....', '##....', '######', '######'],
  N: ['##..##', '###.##', '######', '##.###', '##..##', '##..##', '##..##'],
  O: ['.####.', '######', '##..##', '##..##', '##..##', '######', '.####.'],
  P: ['#####.', '######', '##..##', '######', '#####.', '##....', '##....'],
  Q: ['.####.', '######', '##..##', '##..##', '##.###', '######', '.#####'],
  R: ['#####.', '######', '##..##', '#####.', '##.##.', '##..##', '##..##'],
  T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..'],
  U: ['##..##', '##..##', '##..##', '##..##', '##..##', '######', '.####.'],
  W: ['##...##', '##...##', '##...##', '##.#.##', '#######', '###.###', '##...##'],
  X: ['##..##', '##..##', '.####.', '..##..', '.####.', '##..##', '##..##'],
};

/**
 * Dot-matrix wordmark. Grey at rest; on hover/focus of the cell it lights up
 * (foreground dots with a few primary accents), via `group-*` variants.
 */
function DotWordmark({ word, cell }: { word: string; cell: number }) {
  const rows = Array.from({ length: 7 }, (_, r) =>
    [...word].map((ch) => GLYPHS[ch][r]).join('.'),
  );
  const cols = rows[0].length;
  let seed = [...word].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) >>> 0, 0);
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const rad = (cell * 0.85) / 2;
  const dots: { x: number; y: number; accent: boolean }[] = [];
  rows.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch === '#') dots.push({ x: (c + 0.5) * cell, y: (r + 0.5) * cell, accent: rnd() < 0.07 });
    }),
  );
  return (
    <svg
      width={cols * cell}
      height={7 * cell}
      viewBox={`0 0 ${cols * cell} ${7 * cell}`}
      aria-hidden
      className="block max-w-full"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={rad}
          className={cn(
            'fill-cl-border-400 transition-[fill] duration-250 ease-decelerate',
            d.accent
              ? 'group-hover:fill-primary group-focus-visible:fill-primary'
              : 'group-hover:fill-foreground group-focus-visible:fill-foreground',
          )}
        />
      ))}
    </svg>
  );
}

/** Corner "+" registration marks on the desktop grid lines. */
function Marks() {
  const r1 = 320;
  const r2 = 300;
  const ys = [0.5, r1 + 1.5, r1 + r2 + 2.5];
  const top = ['0.5px', '50%', 'calc(100% - 0.5px)'];
  const mid = ['0.5px', '50%', 'calc(75% + 0.25px)', 'calc(100% - 0.5px)'];
  const marks = [
    ...top.map((x) => ({ x, y: ys[0] })),
    ...mid.map((x) => ({ x, y: ys[1] })),
    ...mid.map((x) => ({ x, y: ys[2] })),
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-px hidden lg:block">
      {marks.map((m, i) => (
        <span
          key={i}
          className="absolute size-[11px] -translate-x-1/2 -translate-y-1/2 before:absolute before:top-0 before:left-[5px] before:h-[11px] before:w-px before:bg-cl-border-400 after:absolute after:top-[5px] after:left-0 after:h-px after:w-[11px] after:bg-cl-border-400"
          style={{ left: m.x, top: m.y }}
        />
      ))}
    </div>
  );
}

const cellBase =
  'group relative flex flex-col overflow-hidden bg-background outline-none transition-colors duration-250 ease-decelerate motion-reduce:transition-none lg:hover:bg-cl-panel-strong-800 lg:focus-visible:bg-cl-panel-strong-800 lg:focus-visible:outline-2 lg:focus-visible:-outline-offset-2 lg:focus-visible:outline-ring';

/** Dither glow at the bottom of each cell, stronger on hover. */
function CellTexture() {
  return (
    <Texture
      kind="ditherRamp"
      className="inset-x-0 bottom-0 h-3/4 bg-cl-border-500 opacity-40 transition-opacity duration-250 group-hover:opacity-100 group-focus-visible:opacity-100"
    />
  );
}

/** "04 — Companies & clients": bento grid of employers plus a "Your company" slot. */
export function CompaniesGrid() {
  return (
    <section
      id="companies"
      aria-labelledby="companies-title"
      className="bg-background pt-12 pb-24 lg:pt-8"
    >
      <SectionLabel index="04" className="gutter-l gap-3 md:gap-4">
        Companies &amp; clients
      </SectionLabel>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-7 px-4 pt-8 md:px-8 md:pt-12 lg:gap-10">
        <div className="flex flex-col gap-4">
          <h2
            id="companies-title"
            className="m-0 max-w-[600px] text-h2 lg:max-w-[760px] lg:text-h1"
          >
            Trusted by teams building AI security, FinTech, and data platforms
          </h2>
          <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 font-mono text-caption font-medium tracking-[0.1em] text-muted-foreground">
            <span>
              <span className="text-foreground">4</span> COMPANIES
            </span>
            <span aria-hidden className="text-input">
              ·
            </span>
            <span>
              <span className="text-foreground">3</span> INTERNATIONAL CLIENTS
            </span>
            <span aria-hidden className="text-input">
              ·
            </span>
            <span>
              <span className="text-foreground">7.8+</span> YEARS
            </span>
          </p>
        </div>

        <div className="relative border border-border bg-border">
          <ul className="m-0 grid list-none grid-cols-1 gap-px p-0 lg:grid-cols-4 lg:grid-rows-[320px_300px]">
            {companies.map((c) => (
              <li
                key={c.id}
                tabIndex={0}
                aria-label={`${c.name}. ${c.role.toLowerCase()}, ${c.years}. ${c.line}.`}
                className={cn(
                  cellBase,
                  'p-6',
                  c.featured ? 'min-h-[260px] lg:p-8' : 'min-h-[220px] lg:p-7',
                  c.span === 2 && 'lg:col-span-2',
                  'max-lg:focus-visible:outline-2 max-lg:focus-visible:-outline-offset-2 max-lg:focus-visible:outline-ring',
                )}
              >
                <CellTexture />
                <div className="relative z-[1] flex min-h-0 grow flex-col">
                  <div className="flex origin-left items-center transition-transform duration-250 ease-decelerate group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none">
                    <span className="lg:hidden">
                      <DotWordmark word={c.word} cell={c.featured ? 5 : 4} />
                    </span>
                    <span className="hidden lg:block">
                      <DotWordmark word={c.word} cell={c.featured ? 7 : 5} />
                    </span>
                  </div>
                  <div className="min-h-4 grow" />
                  <div className="flex flex-col gap-2.5">
                    <p className="m-0 font-mono text-mono-sm tracking-[0.1em] text-muted-foreground">
                      <span className="text-foreground">{c.role}</span> · {c.years}
                    </p>
                    <p
                      className={cn(
                        'm-0 max-w-[460px] text-body-lg font-medium text-foreground',
                        c.featured && 'lg:text-[18px] lg:leading-7',
                      )}
                    >
                      {c.line}
                    </p>
                    {c.tags.length > 0 ? (
                      <ul aria-label="Domains" className="m-0 mt-1 flex list-none flex-wrap gap-1.5 p-0">
                        {c.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-xs border border-cl-border-700 bg-background/60 px-2 py-[3px] font-mono text-[10px] leading-[14px] font-medium tracking-[0.1em] text-muted-foreground"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {c.clients ? (
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="font-mono text-[10px] leading-4 font-medium tracking-[0.12em] text-cl-border-400">
                          CLIENTS
                        </span>
                        <ul aria-label="Clients" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                          {c.clients.map((k) => (
                            <li
                              key={k}
                              className="inline-flex h-7 items-center rounded-full border border-cl-border-700 bg-background/60 px-2.5 text-caption font-medium text-muted-foreground transition-colors duration-250 group-hover:border-input group-hover:text-foreground"
                            >
                              {k}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}

            <li className={cn(cellBase, 'min-h-[220px] p-0 lg:focus-within:bg-cl-panel-strong-800')}>
              <a
                href="#contact"
                className={cn(
                  'relative z-[1] flex h-full flex-col p-6 text-foreground no-underline lg:p-7',
                  focusRing,
                  'focus-visible:-outline-offset-4',
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-2.5 rounded-md border border-dashed border-input transition-colors duration-250 group-hover:border-primary group-focus-within:border-primary"
                />
                <span className="inline-flex items-center gap-2 font-mono text-mono-sm tracking-[0.12em] text-success">
                  <StatusDot pulse />
                  AVAILABLE NOW
                </span>
                <span className="min-h-4 grow" />
                <span className="flex flex-col gap-2">
                  <span className="text-[24px] leading-8 font-bold tracking-[-0.02em] lg:text-[26px]">
                    Your company{' '}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-250 group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transform-none"
                    >
                      →
                    </span>
                  </span>
                  <span className="text-body text-muted-foreground">
                    Full stack, frontend-heavy. Ready to start immediately.
                  </span>
                </span>
                <span className="sr-only">Contact {site.name}</span>
              </a>
            </li>
          </ul>
          <Marks />
        </div>
      </div>
    </section>
  );
}
