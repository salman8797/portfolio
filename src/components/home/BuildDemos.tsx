'use client';

import { useState, type ReactNode } from 'react';
import { CheckIcon, TriangleAlertIcon } from 'lucide-react';
import { Badge, Button, Card, SectionLabel, StatusDot } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { Texture } from '@/components/textures/Texture';
import { useTick } from '@/hooks/useTick';

const mono11 = 'font-mono text-mono-sm tracking-[0.08em] text-muted-foreground';
const inset = 'rounded-md border border-border bg-background/72';
const chip = 'rounded-sm bg-accent px-1.5 py-px text-accent-foreground shadow-[inset_0_0_0_1px_var(--cl-lavender-600)]';

type TextureKind = 'dither' | 'chevrons' | 'shot';

function DemoCard({
  title,
  meta,
  texture,
  className,
  children,
}: {
  title: string;
  meta: ReactNode;
  texture: TextureKind;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        'group relative transition-[transform,border-color] duration-200 ease-standard hover:-translate-y-1 hover:border-input motion-reduce:hover:translate-y-0 lg:min-h-[340px]',
        className,
      )}
      contentClassName="relative z-[1] flex h-full flex-col gap-3 p-4 lg:gap-4 lg:p-5"
    >
      {texture === 'dither' ? (
        <Texture kind="ditherRamp" className="inset-x-0 bottom-0 h-[64%] bg-cl-border-500 opacity-40 transition-opacity duration-200 group-hover:opacity-85" />
      ) : texture === 'chevrons' ? (
        <Texture kind="chevrons" className="inset-x-0 bottom-0 h-[64%] bg-cl-border-500 opacity-40 transition-opacity duration-200 group-hover:opacity-85" />
      ) : (
        <Texture kind="ditherField" fade="down" className="inset-0 bg-cl-border-600 opacity-30 transition-opacity duration-200 group-hover:opacity-60" />
      )}
      <div className="flex items-center justify-between gap-3">
        <h3 className="m-0 text-h4">{title}</h3>
        {meta}
      </div>
      {children}
    </Card>
  );
}

/* 01 — Prompt DLP redaction ---------------------------------------------------------- */

function DlpDemo({ tick, reduced }: { tick: number; reduced: boolean }) {
  const [manual, setManual] = useState<boolean | null>(null);
  const redacted = manual ?? (reduced ? true : tick % 4 >= 2);
  const flagged = 'underline decoration-warning decoration-wavy underline-offset-4';
  return (
    <DemoCard
      title="Prompt DLP redaction"
      meta={<span className={mono11}>01<span className="hidden lg:inline"> / AI-SECURITY</span></span>}
      texture="dither"
      className="md:col-span-2"
    >
      <div className={cn(inset, 'flex grow flex-col gap-3 p-3 lg:p-4')}>
        <span className={mono11}>PROMPT</span>
        {redacted ? (
          <p key="r" className="animate-pop m-0 font-mono text-body-sm leading-[22px] text-foreground">
            Summarise this contract for <span className={chip}>[EMAIL_1]</span> and call the billing API with
            key <span className={chip}>[API_KEY_1]</span>.
          </p>
        ) : (
          <p key="o" className="m-0 font-mono text-body-sm leading-[22px] text-foreground">
            Summarise this contract for <span className={flagged}>jane.doe@acme.com</span> and call the billing
            API with key <span className={flagged}>sk-live-4f9a…c21</span>.
          </p>
        )}
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <span role="status" className={cn('inline-flex items-center gap-2 text-body-sm', redacted ? 'text-success' : 'text-warning')}>
            {redacted ? (
              <>
                <CheckIcon aria-hidden className="size-4" />
                Redacted 2 items · safe to send
              </>
            ) : (
              <>
                <TriangleAlertIcon aria-hidden className="size-4" />
                2 findings: 1 email address, 1 API key
              </>
            )}
          </span>
          <Button variant="outline" size="sm" className="self-start bg-transparent font-medium" onClick={() => setManual(!redacted)}>
            {redacted ? 'Show original' : 'Redact & send'}
          </Button>
        </div>
      </div>
    </DemoCard>
  );
}

/* 02 — Token theming ----------------------------------------------------------------- */

// The three accent scales from the library tokens, applied as live CSS variables.
const THEMES = [
  { name: 'Lavender', hex: 'var(--cl-lavender-200)', soft: 'var(--cl-lavender-800)', softFg: 'var(--cl-lavender-100)', code: '#AE87ED' },
  { name: 'Violet', hex: 'var(--cl-violet-300)', soft: 'var(--cl-violet-700)', softFg: 'var(--cl-violet-50)', code: '#9C6DE9' },
  { name: 'Mauve', hex: 'var(--cl-mauve-200)', soft: 'var(--cl-mauve-800)', softFg: 'var(--cl-mauve-100)', code: '#D7A0EE' },
];

function ThemeDemo({ tick }: { tick: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const ti = picked ?? Math.floor(tick / 2) % 3;
  const th = THEMES[ti];
  return (
    <DemoCard title="Token theming" meta={<span className={mono11}>02</span>} texture="chevrons">
      <div className={cn(inset, 'flex grow flex-col gap-4 p-3 lg:p-4')}>
        <div className="flex gap-2" role="group" aria-label="Theme">
          {THEMES.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`${t.name} theme`}
              aria-pressed={i === ti}
              onClick={() => setPicked(i)}
              className="size-7 cursor-pointer rounded-full border-0 p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                background: t.hex,
                boxShadow: i === ti ? '0 0 0 2px var(--background), 0 0 0 4px var(--foreground)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <span
            className="inline-flex h-8 items-center self-start rounded-md px-3.5 text-body-sm font-semibold text-primary-foreground transition-colors duration-300 ease-standard"
            style={{ background: th.hex }}
          >
            Primary action
          </span>
          <span
            className="inline-flex self-start rounded-full px-2.5 py-0.5 text-caption font-medium"
            style={{ background: th.soft, color: th.softFg }}
          >
            {th.name} theme
          </span>
          <span className="h-1.5 overflow-hidden rounded-full bg-popover">
            <span
              className="block h-full w-[64%] rounded-full transition-colors duration-300 ease-standard"
              style={{ background: th.hex }}
            />
          </span>
        </div>
        <code className="mt-auto font-mono text-mono-sm text-muted-foreground">
          --primary: <span className="text-foreground">{th.code}</span>;
        </code>
      </div>
    </DemoCard>
  );
}

/* 03 — Focus ring -------------------------------------------------------------------- */

function FocusDemo({ tick }: { tick: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const fi = picked ?? tick % 3;
  const ring = (i: number) =>
    cn('outline-2 outline-offset-2', i === fi ? 'outline-ring outline' : 'outline-transparent outline');
  const item = 'flex h-8 items-center rounded-sm px-3 text-body-sm';
  return (
    <DemoCard
      title="Focus ring"
      meta={<span className={mono11}>03<span className="hidden lg:inline"> / A11Y</span></span>}
      texture="dither"
    >
      <div className={cn(inset, 'flex grow flex-col justify-between gap-4 p-3 lg:p-4')}>
        <div aria-hidden className="flex flex-col gap-3 p-1">
          <span className={cn(item, 'border border-input text-foreground', ring(0))}>Cancel</span>
          <span className={cn(item, 'border border-input text-foreground', ring(1))}>Save draft</span>
          <span className={cn(item, 'bg-primary font-semibold text-primary-foreground', ring(2))}>Publish</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-mono-sm text-muted-foreground">2PX RING · ≥3:1</span>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border border-input bg-popover px-2.5 font-mono text-mono-sm"
            onClick={() => setPicked((fi + 1) % 3)}
          >
            Tab ⇥
          </Button>
        </div>
      </div>
    </DemoCard>
  );
}

/* 04 — Code review diff -------------------------------------------------------------- */

function DiffDemo({ tick, reduced }: { tick: number; reduced: boolean }) {
  const rv = tick % 5;
  const approved = reduced || rv >= 3;
  const showComment = reduced || rv >= 1;
  const line = 'flex';
  const gutter = 'w-10 shrink-0 pl-3';
  const del = 'bg-destructive/10 text-foreground';
  const add = 'bg-success/10 text-foreground';
  return (
    <DemoCard
      title="Code review diff"
      texture="shot"
      className="md:col-span-2"
      meta={
        approved ? (
          <Badge key="a" variant="success" icon={<CheckIcon aria-hidden />} className="animate-pop font-medium">
            Approved
          </Badge>
        ) : (
          <Badge variant="info" dot className="font-medium">
            Review requested
          </Badge>
        )
      }
    >
      <div className="flex grow flex-col overflow-hidden rounded-md border border-border bg-background/82">
        <div className="flex items-center justify-between border-b border-border px-3 py-2 font-mono text-mono-sm text-muted-foreground">
          <span>src/ui/Button.styles.ts</span>
          <span>
            <span className="text-success">+2</span> <span className="text-destructive">−2</span>
          </span>
        </div>
        <div className="overflow-x-auto font-mono text-body-sm leading-[22px] whitespace-pre">
          <div className={cn(line, 'text-muted-foreground')}>
            <span className={cn(gutter, 'text-input')}>12</span>
            <span>{'  const styles = {'}</span>
          </div>
          <div className={cn(line, del)}>
            <span className={cn(gutter, 'text-destructive')}>−</span>
            <span>
              {'    background: '}
              <span className="text-destructive">&apos;#AE87ED&apos;</span>,
            </span>
          </div>
          <div className={cn(line, add)}>
            <span className={cn(gutter, 'text-success')}>+</span>
            <span>
              {'    background: '}
              <span className="text-success">&apos;var(--primary)&apos;</span>,
            </span>
          </div>
          <div className={cn(line, del)}>
            <span className={cn(gutter, 'text-destructive')}>−</span>
            <span>
              {'    color: '}
              <span className="text-destructive">&apos;#0F0E16&apos;</span>,
            </span>
          </div>
          <div className={cn(line, add)}>
            <span className={cn(gutter, 'text-success')}>+</span>
            <span>
              {'    color: '}
              <span className="text-success">&apos;var(--primary-foreground)&apos;</span>,
            </span>
          </div>
          <div className={cn(line, 'text-muted-foreground')}>
            <span className={cn(gutter, 'text-input')}>15</span>
            <span>{'  }'}</span>
          </div>
        </div>
        {showComment ? (
          <div className="animate-pop m-3 flex gap-2.5 rounded-md border border-border bg-card p-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-mono-sm font-semibold text-accent-foreground"
            >
              SS
            </span>
            <p className="m-0 text-body-sm text-foreground">
              Nice — semantic tokens instead of hex. This now themes for free.
            </p>
          </div>
        ) : null}
      </div>
    </DemoCard>
  );
}

/* 05 — Live chart -------------------------------------------------------------------- */

function ChartDemo({ tick }: { tick: number }) {
  const N = 24;
  const W = 240;
  const H = 96;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i + tick;
    const v = 0.5 + 0.28 * Math.sin(t * 0.55) + 0.12 * Math.sin(t * 1.7 + 1);
    return [(i / (N - 1)) * W, H - 8 - v * (H - 16), v] as const;
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[N - 1];
  return (
    <DemoCard
      title="Live chart"
      texture="chevrons"
      meta={
        <span className="inline-flex items-center gap-1.5 font-mono text-mono-sm tracking-[0.08em] text-success">
          <StatusDot pulse />
          LIVE
        </span>
      }
    >
      <div className={cn(inset, 'flex grow flex-col gap-3 p-3 lg:p-4')}>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-mono-sm text-muted-foreground">P95 LATENCY · SAMPLE</span>
          <span className="font-mono text-[24px] leading-8 font-medium tracking-[-0.02em] tabular-nums">
            {Math.round(120 + last[2] * 120)}
            <span className="text-body-sm text-muted-foreground"> ms</span>
          </span>
        </div>
        <svg
          role="img"
          aria-label="Sparkline of p95 latency over the last 24 samples"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-auto h-[120px] w-full overflow-visible"
        >
          <path d="M0 24 H240 M0 48 H240 M0 72 H240" className="stroke-border" strokeWidth="1" fill="none" />
          <path d={`${line} L${W} ${H} L0 ${H} Z`} className="fill-primary/12" />
          <path
            d={line}
            fill="none"
            className="stroke-primary"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={W} cy={last[1]} r="3.5" className="fill-primary stroke-background" strokeWidth="2" />
        </svg>
      </div>
    </DemoCard>
  );
}

/* 06 — Sprint board ------------------------------------------------------------------ */

function SprintDemo({ tick, reduced }: { tick: number; reduced: boolean }) {
  const phase = reduced ? 2 : Math.floor(tick / 2) % 3;
  const task = 'block rounded-sm border border-border bg-card p-2 text-caption';
  const moving = cn('animate-pop block rounded-sm p-2 text-caption', chip);
  const cols: { label: string; fixed: ReactNode }[] = [
    { label: 'TO DO', fixed: <span className={task}>Docs IA</span> },
    { label: 'DOING', fixed: <span className={task}>Chart lib</span> },
    { label: 'DONE', fixed: <span className={cn(task, 'text-muted-foreground line-through')}>Tokens v2</span> },
  ];
  return (
    <DemoCard title="Sprint board" meta={<span className={mono11}>SPRINT 14</span>} texture="shot">
      <div className="grid min-h-[132px] grow grid-cols-3 gap-2 rounded-md border border-border bg-background/80 p-2.5 lg:p-3">
        {cols.map((c, i) => (
          <div key={c.label} className="flex flex-col gap-2">
            <span className={mono11}>{c.label}</span>
            {c.fixed}
            {phase === i ? (
              <span key={`move-${i}`} className={moving}>
                A11y audit
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

/** "05 — What I build": six live miniatures on one shared clock. */
export function BuildDemos() {
  const { tick, reduced } = useTick(1200);
  return (
    <section aria-labelledby="build-title" className="pt-12 pb-24 md:pt-16 md:pb-32">
      <SectionLabel index="05" className="gutter-l gap-3 md:gap-4">
        What I build
      </SectionLabel>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 pt-8 md:px-8 md:pt-12 lg:gap-10">
        <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-6">
          <h2 id="build-title" className="m-0 text-h2 lg:text-h1">
            Six small, working demos
          </h2>
          <p className="m-0 mb-2 max-w-[420px] text-body text-muted-foreground lg:mb-0 lg:text-body-lg">
            Each card is a live miniature of the kind of interface I build. Try the controls.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          <DlpDemo tick={tick} reduced={reduced} />
          <ThemeDemo tick={tick} />
          <FocusDemo tick={tick} />
          <DiffDemo tick={tick} reduced={reduced} />
          <ChartDemo tick={tick} />
          <SprintDemo tick={tick} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
