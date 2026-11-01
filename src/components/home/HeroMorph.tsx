'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react';
import { usePrefersReducedMotion } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { LOCKUP_GRID } from '@/components/brand/logo-grid';
import { techStack } from '@/content/site';
import { tokenRgb, rgbCss } from '@/lib/tokens';

type Point = [number, number, ('L' | 'D')?];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  tone: number;
  acc: boolean;
  amb: boolean;
  wait: number;
  ph: number;
};

const LOCKUP = { id: 'lockup', name: 'Salman Sayyed', cap: 'Full Stack Developer · Frontend-Heavy' };
const N_ITEMS = techStack.length;
const pad2 = (v: number) => (v < 10 ? '0' : '') + v;
const capLine = (cap: string) => cap.toUpperCase().replace(/\bAPIS\b/g, 'APIs');

/** Index -1 is the logo lockup; 0..n-1 are tech items. */
const itemAt = (i: number) => (i < 0 ? LOCKUP : techStack[((i % N_ITEMS) + N_ITEMS) % N_ITEMS]);
const wrap = (i: number) => {
  const m = N_ITEMS + 1;
  return ((((i + 1) % m) + m) % m) - 1;
};

type Engine = {
  goTo: (i: number) => void;
  idx: () => number;
  setMouse: (p: { x: number; y: number } | null) => void;
  flags: { hover: boolean; paused: boolean; cardOpen: boolean };
  resetHold: () => void;
};

/**
 * The hero's dot-particle canvas: starts as the logo lockup, then morphs through the
 * tech stack. Click the shape for a "proof" card. Hover pauses and repels dots;
 * reduced motion swaps auto-play for previous / next buttons.
 */
export function HeroMorph({ layout = 'desktop' }: { layout?: 'desktop' | 'mobile' }) {
  const mobile = layout === 'mobile';
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const engine = useRef<Engine | null>(null);
  const reducedRef = useRef(reduced);

  const [idx, setIdx] = useState(-1);
  const [shown, setShown] = useState(-1);
  const [capVisible, setCapVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const capTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const onIndexChange = useCallback((next: number) => {
    setIdx(next);
    clearTimeout(capTimer.current);
    if (reducedRef.current) {
      setShown(next);
      setCapVisible(true);
      return;
    }
    setCapVisible(false);
    capTimer.current = setTimeout(() => {
      setShown(next);
      setCapVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const N = mobile ? 640 : 1000;
    let seed = 20261027;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const ink = tokenRgb('--foreground', [246, 246, 249]);
    const colors = [
      rgbCss(tokenRgb('--cl-border-600', [86, 81, 112])),
      rgbCss(tokenRgb('--cl-border-400', [135, 131, 165])),
      rgbCss(tokenRgb('--muted-foreground', [183, 179, 198])),
      rgbCss(ink),
      rgbCss(tokenRgb('--primary', [174, 135, 237])),
      rgbCss(tokenRgb('--cl-border-600', [86, 81, 112]), 0.55),
    ];

    let w = 40;
    let h = 40;
    let dpr = 1;
    let cache: Record<string, Point[]> = {};
    let lockDot = 2;
    let dotSize = 2;
    let parts: Particle[] = [];
    let index = -1;
    let phase: 'trans' | 'hold' = 'trans';
    let transStart = 0;
    let holdStart = 0;
    let mouse: { x: number; y: number } | null = null;
    let staticDrawn = false;
    const flags = { hover: false, paused: false, cardOpen: false };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(40, r.width);
      h = Math.max(40, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    };

    const curId = () => (index < 0 ? 'lockup' : itemAt(index).id);

    const targetsFor = (id: string): Point[] => {
      if (cache[id]) return cache[id];
      const W = Math.round(w);
      const H = Math.round(h);
      if (id === 'lockup') {
        const cols = LOCKUP_GRID[0].length;
        const rows = LOCKUP_GRID.length;
        const pitch = Math.min((W * 0.96) / cols, (H * 0.62) / rows);
        const x0 = (W - cols * pitch) / 2;
        const y0 = (H - rows * pitch) / 2;
        const pts: Point[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ch = LOCKUP_GRID[r][c];
            if (ch === '#') pts.push([x0 + c * pitch + pitch / 2, y0 + r * pitch + pitch / 2, 'L']);
            else if (ch === '|') {
              pts.push([x0 + c * pitch + pitch / 2, y0 + r * pitch + pitch * 0.25, 'D']);
              pts.push([x0 + c * pitch + pitch / 2, y0 + r * pitch + pitch * 0.75, 'D']);
            }
          }
        }
        lockDot = Math.max(2, Math.round(pitch * 0.62));
        cache[id] = pts;
        return pts;
      }
      // Rasterise the word in JetBrains Mono, then sample it on a grid.
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const g = c.getContext('2d', { willReadFrequently: true })!;
      const lines = techStack.find((t) => t.id === id)!.word;
      const family = getComputedStyle(document.documentElement).getPropertyValue('--font-jetbrains-mono') || 'monospace';
      const maxW = W * 0.9;
      const maxH = H * 0.74;
      let fs = maxH / (lines.length * 0.98);
      g.font = `700 ${fs}px ${family}, ui-monospace, monospace`;
      const mw = Math.max(...lines.map((l) => g.measureText(l).width));
      if (mw > maxW) fs = (fs * maxW) / mw;
      g.font = `700 ${fs}px ${family}, ui-monospace, monospace`;
      g.fillStyle = '#fff';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      const lh = fs * 0.98;
      const ly0 = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => g.fillText(l, W / 2, ly0 + i * lh));
      const data = g.getImageData(0, 0, W, H).data;
      let area = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 110) area += 4;
      const pitch = Math.max(3.5, Math.min(9, Math.sqrt(area / (N * 0.9))));
      const pts: Point[] = [];
      for (let y = pitch / 2; y < H; y += pitch) {
        for (let x = pitch / 2; x < W; x += pitch) {
          const xi = Math.round(x);
          const yi = Math.round(y);
          if (data[(yi * W + xi) * 4 + 3] > 110) pts.push([Math.round(x / 2) * 2, Math.round(y / 2) * 2]);
        }
      }
      cache[id] = pts;
      return pts;
    };

    const assign = (pts: Point[], burst: boolean) => {
      const order = parts.map((_, i) => i).sort((a, b) => parts[a].x - parts[b].x);
      const tg = pts.slice();
      for (let i = tg.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [tg[i], tg[j]] = [tg[j], tg[i]];
      }
      const shape = tg.slice(0, N).sort((a, b) => a[0] - b[0]);
      const n = shape.length;
      const step = n > 0 ? N / n : 1;
      let si = 0;
      order.forEach((pi, k) => {
        const p = parts[pi];
        const useShape = n > 0 && Math.floor(k / step) !== Math.floor((k - 1) / step) && si < n;
        if (useShape || n >= N) {
          const t = shape[Math.min(si, n - 1)];
          si++;
          p.tx = t[0];
          p.ty = t[1];
          p.amb = false;
          const r = rand();
          if (t[2] === 'L') {
            p.tone = r < 0.7 ? 3 : 2;
            p.acc = rand() < 0.04;
          } else if (t[2] === 'D') {
            p.tone = 0;
            p.acc = false;
            p.amb = true;
          } else {
            p.tone = r < 0.08 ? 3 : r < 0.32 ? 2 : r < 0.68 ? 1 : 0;
            p.acc = rand() < 0.035;
          }
        } else {
          p.tx = Math.round((rand() * w) / 2) * 2;
          p.ty = Math.round((rand() * h) / 2) * 2;
          p.amb = true;
          p.tone = 0;
          p.acc = false;
        }
        if (burst) {
          const dx = p.x - w / 2;
          const dy = p.y - h / 2;
          const dd = Math.hypot(dx, dy) || 1;
          const sp = 140 + rand() * 170;
          p.vx += (dx / dd) * sp + (rand() - 0.5) * 90;
          p.vy += (dy / dd) * sp + (rand() - 0.5) * 90;
          p.wait = 0.12 + rand() * 0.2;
        }
      });
    };

    const snap = () => {
      parts.forEach((p) => {
        p.x = p.tx;
        p.y = p.ty;
        p.vx = 0;
        p.vy = 0;
        p.wait = 0;
      });
    };

    const initParticles = () => {
      const pts = targetsFor(curId());
      dotSize = curId() === 'lockup' ? lockDot : 2;
      parts = Array.from({ length: N }, () => ({
        x: rand() * w,
        y: rand() * h,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        tone: 0,
        acc: false,
        amb: false,
        wait: 0,
        ph: rand() * 6.28,
      }));
      assign(pts, false);
      const red = reducedRef.current;
      parts.forEach((p) => {
        p.y = Math.min(h, p.ty + 30 + rand() * 90);
        p.x = p.tx + (rand() - 0.5) * 60;
        p.wait = red ? 0 : rand() * 0.8;
      });
      if (red) {
        snap();
        phase = 'hold';
        holdStart = performance.now();
      }
    };

    const goTo = (i: number) => {
      index = wrap(i);
      const red = reducedRef.current;
      assign(targetsFor(curId()), !red);
      dotSize = curId() === 'lockup' ? lockDot : 2;
      if (red) {
        snap();
        staticDrawn = false;
        phase = 'hold';
      } else {
        phase = 'trans';
        transStart = performance.now();
      }
      holdStart = performance.now();
      onIndexChange(index);
    };

    const draw = (t: number, holding: boolean) => {
      const g = cv.getContext('2d')!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const B: number[][] = [[], [], [], [], [], []];
      const big = dotSize;
      for (const p of parts) {
        let b: number;
        if (p.amb) b = 5;
        else if (holding && p.acc) b = 4;
        else {
          b = p.tone;
          if (holding && Math.sin(t * 2.2 + p.ph * 3) > 0.94) b = Math.min(3, b + 1);
        }
        if (b === 5 || big <= 2) B[b].push(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2);
        else B[b].push(Math.round(p.x - big / 2), Math.round(p.y - big / 2));
      }
      B.forEach((a, b) => {
        g.fillStyle = colors[b];
        const sz = b === 5 ? 2 : big;
        for (let i = 0; i < a.length; i += 2) g.fillRect(a[i], a[i + 1], sz, sz);
      });
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) {
        last = now;
        return;
      }
      if (reducedRef.current) {
        if (!staticDrawn) {
          snap();
          draw(0, true);
          staticDrawn = true;
        }
        last = now;
        return;
      }
      staticDrawn = false;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      if (phase === 'trans' && now - transStart > 900) {
        phase = 'hold';
        holdStart = now;
      }
      const busy = flags.paused || flags.hover || flags.cardOpen;
      if (phase === 'hold' && !busy && now - holdStart > (index < 0 ? 2000 : 2500)) goTo(index + 1);
      const k = 55;
      const c = 10;
      const R = 60;
      const m = !mobile && mouse ? mouse : null;
      for (const p of parts) {
        let ax = 0;
        let ay = 0;
        if (p.wait > 0) {
          p.wait -= dt;
          const damp = Math.exp(-3.2 * dt);
          p.vx *= damp;
          p.vy *= damp;
        } else {
          ax = k * (p.tx - p.x) - c * p.vx;
          ay = k * (p.ty - p.y) - c * p.vy;
        }
        if (m) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.01) {
            const f = 2600 * (1 - d / R);
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      draw(t, phase === 'hold');
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      resize();
      initParticles();
      last = performance.now();
      transStart = last;
      frame = requestAnimationFrame(tick);
    };
    // Wait for JetBrains Mono so the words rasterise in the right face.
    document.fonts?.ready.then(start, start);
    const fallback = setTimeout(start, 600);

    const ro = new ResizeObserver(() => {
      if (!started) return;
      const ow = w;
      const oh = h;
      resize();
      if (Math.abs(ow - w) > 1 || Math.abs(oh - h) > 1) {
        cache = {};
        assign(targetsFor(curId()), false);
        snap();
        staticDrawn = false;
      }
    });
    ro.observe(cv);

    engine.current = {
      goTo,
      idx: () => index,
      setMouse: (p) => {
        mouse = p;
      },
      flags,
      resetHold: () => {
        holdStart = performance.now();
      },
    };

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      ro.disconnect();
      engine.current = null;
    };
  }, [mobile, onIndexChange]);

  useEffect(() => () => clearTimeout(capTimer.current), []);

  // Move focus into / out of the proof card.
  useEffect(() => {
    if (cardOpen) closeRef.current?.focus();
  }, [cardOpen]);

  const it = itemAt(shown);
  const cur = itemAt(idx);
  const intro = idx < 0;

  const openCard = () => {
    const e = engine.current;
    if (!e) return;
    if (e.idx() < 0) {
      e.goTo(0);
      return;
    }
    e.flags.cardOpen = true;
    setCardOpen(true);
  };

  const closeCard = () => {
    const e = engine.current;
    if (e) {
      e.flags.cardOpen = false;
      e.resetHold();
    }
    setCardOpen(false);
    shapeRef.current?.focus();
  };

  const onCardKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeCard();
  };

  const togglePause = () => {
    const e = engine.current;
    if (e) {
      e.flags.paused = !paused;
      e.resetHold();
    }
    setPaused(!paused);
  };

  const ctrl = cn(
    'flex items-center justify-center rounded-sm border-0 bg-transparent p-0 text-cl-border-400 transition-colors hover:text-foreground',
    mobile ? 'size-11' : 'size-7',
    focusRing,
  );

  const prevName = idx === 0 ? `${LOCKUP.name} logo` : itemAt(idx - 1).name;
  const nextName = idx === N_ITEMS - 1 ? `${LOCKUP.name} logo` : itemAt(idx + 1).name;

  return (
    <div className={cn('flex w-full flex-col text-foreground', mobile ? 'gap-3' : 'gap-4')}>
      <div className="relative" style={{ height: mobile ? 260 : 400 }}>
        <button
          ref={shapeRef}
          type="button"
          aria-label={intro ? `${LOCKUP.name} logo — skip to tech stack` : `${cur.name} — open proof card`}
          onClick={openCard}
          onMouseMove={(e) => {
            if (mobile || reduced || !canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect();
            engine.current?.setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onMouseEnter={() => {
            if (engine.current) engine.current.flags.hover = true;
          }}
          onMouseLeave={() => {
            const e = engine.current;
            if (!e) return;
            e.flags.hover = false;
            e.setMouse(null);
            e.resetHold();
          }}
          className={cn(
            'absolute inset-0 m-0 size-full cursor-pointer touch-manipulation rounded-lg border-0 bg-transparent p-0',
            focusRing,
          )}
        >
          <canvas ref={canvasRef} aria-hidden className="block size-full" />
        </button>

        {cardOpen && idx >= 0 ? (
          <section
            aria-label={`Proof: ${it.name}`}
            onKeyDown={onCardKey}
            className={cn(
              'animate-pop absolute top-1/2 z-[2] flex -translate-y-1/2 flex-col gap-3 rounded-lg border border-border bg-card/95 p-5 shadow-popover backdrop-blur-md',
              mobile ? 'inset-x-0' : 'inset-x-6',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-mono-sm tracking-[0.12em] text-primary">
                PROOF · {pad2(idx + 2)} / {pad2(N_ITEMS + 1)}
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close proof card"
                onClick={closeCard}
                className={cn(
                  'flex size-8 cursor-pointer items-center justify-center rounded-sm border border-border bg-card p-0 text-foreground',
                  focusRing,
                )}
              >
                <XIcon aria-hidden className="size-3.5" />
              </button>
            </div>
            <h3 className="m-0 text-h3 tracking-[-0.01em]">{it.name}</h3>
            <p className="m-0 text-body text-muted-foreground">
              [1–2 lines of evidence from your experience with {it.name}: what you built, for whom, and the outcome.]
            </p>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-border pt-3 font-mono text-mono-sm">
              <dt className="tracking-[0.08em] text-muted-foreground">COMPANY</dt>
              <dd className="m-0">[Company]</dd>
              <dt className="tracking-[0.08em] text-muted-foreground">FOCUS</dt>
              <dd className="m-0">{capLine(it.cap)}</dd>
            </dl>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {'lab' in it && it.lab ? (
                <Link
                  href="/lab"
                  className={cn('inline-flex min-h-11 items-center rounded-xs text-label text-foreground no-underline', focusRing)}
                >
                  See it in the Lab →
                </Link>
              ) : null}
              <a
                href="#contact"
                className={cn(
                  'inline-flex min-h-11 items-center rounded-xs text-label font-semibold text-primary no-underline hover:text-accent-foreground',
                  focusRing,
                )}
              >
                Need this on your team? Let’s talk →
              </a>
            </div>
          </section>
        ) : null}
      </div>

      <div className={cn('flex flex-col gap-2', mobile ? 'items-start' : 'items-center')}>
        <p
          className={cn(
            'm-0 min-h-8 font-mono text-mono-sm tracking-[0.08em] text-muted-foreground transition-opacity duration-300 ease-standard',
            mobile ? 'text-left' : 'text-center',
          )}
          style={{ opacity: capVisible ? 1 : 0 }}
        >
          <span className="text-foreground">{it.name.toUpperCase()}</span> · {capLine(it.cap)}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-mono-sm tracking-[0.08em] text-cl-border-400 tabular-nums">
            {pad2(idx + 2)} / {pad2(N_ITEMS + 1)}
          </span>
          {reduced ? (
            <>
              <button type="button" aria-label={`Previous: ${prevName}`} onClick={() => engine.current?.goTo(idx - 1)} className={ctrl}>
                <ChevronLeftIcon aria-hidden className="size-3" />
              </button>
              <button type="button" aria-label={`Next: ${nextName}`} onClick={() => engine.current?.goTo(idx + 1)} className={ctrl}>
                <ChevronRightIcon aria-hidden className="size-3" />
              </button>
            </>
          ) : (
            <button
              type="button"
              aria-label={paused ? 'Play tech stack cycle' : 'Pause tech stack cycle'}
              aria-pressed={paused}
              onClick={togglePause}
              className={ctrl}
            >
              {paused ? (
                <PlayIcon aria-hidden className="size-2.5 fill-current" />
              ) : (
                <PauseIcon aria-hidden className="size-2.5 fill-current" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
