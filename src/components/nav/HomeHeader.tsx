'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Button, SlidingNav } from '@salman8797/component-library';
import { cn, focusRing } from '@salman8797/component-library/utils';

import { LogoMark } from '@/components/brand/LogoMark';
import { navItems, site } from '@/content/site';

import { MobileMenu } from './MobileMenu';
import { renderNavLink } from './NavLink';

const COMPACT_AFTER = 80; // px scrolled before the bar becomes a floating pill
const DESKTOP_MARK = 32;
const MOBILE_MARK = 26;
const markWidth = (h: number) => h * 1.6; // the mark is a 16 × 10 grid

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Scroll-driven 0/1 state for the "nav shrink on scroll" boards. */
function useCompactNav() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const check = () => setCompact(window.scrollY > COMPACT_AFTER);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);
  return compact;
}

/** Glass gradient shown while the bar is full width; fades out as it becomes a pill. */
function BarGradient({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] transition-opacity duration-300 ease-decelerate motion-reduce:transition-none"
      style={{
        opacity: visible ? 1 : 0,
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, color-mix(in srgb, var(--background) 72%, transparent) 100%)',
      }}
    />
  );
}

const barTransition =
  'transition-[width,height,margin-top,padding,border-radius,background-color,border-color,box-shadow] duration-300 ease-decelerate motion-reduce:transition-none';

function barStyle(compact: boolean): CSSProperties {
  return {
    backgroundColor: `color-mix(in srgb, var(--card) ${compact ? 88 : 0}%, transparent)`,
    borderColor: compact
      ? 'var(--border)'
      : 'transparent transparent var(--border) transparent',
    boxShadow: `0 8px 24px rgb(0 0 0 / ${compact ? 0.35 : 0})`,
  };
}

export function HomeHeader() {
  const compact = useCompactNav();
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [geom, setGeom] = useState({ links: 420, cta: 85, measuredCompact: false });

  // Measure the centre links and CTA so the pill can animate to an exact width.
  useIsoLayoutEffect(() => {
    const measure = () => {
      setGeom({
        links: linksRef.current?.getBoundingClientRect().width ?? 420,
        cta: ctaRef.current?.getBoundingClientRect().width ?? 85,
        measuredCompact: compact,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
    // Re-measure only on mount and resize: widths mid-transition would be wrong.
     
  }, []);

  // Compact density trims 28px off the links and 4px off the CTA (design measurements).
  const linksCompact = geom.measuredCompact ? geom.links : geom.links - 28;
  const ctaCompact = geom.measuredCompact ? geom.cta : geom.cta - 4;
  const desktopPillW = Math.round(20 + markWidth(DESKTOP_MARK) + linksCompact + ctaCompact + 24 + 2 + 8);
  const mobilePillW = Math.round(12 + markWidth(MOBILE_MARK) + 12 + 44 + 2 + 2);

  return (
    <header className="pointer-events-none sticky top-0 z-30 h-[57px] lg:h-[65px]">
      {/* Desktop */}
      <nav
        aria-label="Primary"
        className={cn(
          'pointer-events-auto relative mx-auto box-border hidden items-center gap-3 border border-solid backdrop-blur-[10px] lg:flex',
          barTransition,
        )}
        style={{
          ...barStyle(compact),
          width: compact ? `${desktopPillW}px` : '100%',
          height: compact ? 48 : 65,
          marginTop: compact ? 12 : 0,
          paddingInline: compact ? '10px' : 'max(32px, calc((100% - 1216px) / 2))',
          borderRadius: compact ? 24 : 0,
        }}
      >
        <BarGradient visible={!compact} />
        <div className="flex min-w-max flex-1 basis-0 items-center justify-start">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className={cn('flex items-center rounded-md text-foreground no-underline', focusRing)}
          >
            <LogoMark size={DESKTOP_MARK} className="block shrink-0" />
            <span
              aria-hidden
              className="flex items-center gap-3 overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding] duration-300 ease-decelerate motion-reduce:transition-none"
              style={{
                maxWidth: compact ? 0 : 180,
                paddingLeft: compact ? 0 : 12,
                opacity: compact ? 0 : 1,
              }}
            >
              <span className="h-6 w-px shrink-0 bg-border" />
              <span className="font-mono text-body-sm font-semibold tracking-[0.08em]">
                SALMAN SAYYED
              </span>
            </span>
          </Link>
        </div>
        <div ref={linksRef}>
          <SlidingNav
            items={navItems}
            activeId="home"
            density={compact ? 'compact' : 'full'}
            renderLink={renderNavLink}
            persistKey="nav-from"
          />
        </div>
        <div className="flex min-w-max flex-1 basis-0 items-center justify-end">
          <Button
            asChild
            variant="inverse"
            className="overflow-hidden whitespace-nowrap transition-[height,padding,border-radius,background-color] duration-300 ease-decelerate"
            style={{
              height: compact ? 32 : 40,
              paddingInline: compact ? 14 : 16,
              borderRadius: compact ? 16 : 8,
            }}
          >
            <a ref={ctaRef} href="#contact">
              Contact
            </a>
          </Button>
        </div>
      </nav>

      {/* Mobile */}
      <nav
        aria-label="Primary"
        className={cn(
          'pointer-events-auto relative mx-auto box-border flex items-center justify-between border border-solid backdrop-blur-[10px] lg:hidden',
          barTransition,
        )}
        style={{
          ...barStyle(compact),
          width: compact ? `${mobilePillW}px` : '100%',
          height: compact ? 48 : 57,
          marginTop: compact ? 10 : 0,
          paddingLeft: compact ? 12 : 16,
          paddingRight: compact ? 4 : 12,
          borderRadius: compact ? 24 : 0,
        }}
      >
        <BarGradient visible={!compact} />
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className={cn('flex items-center rounded-md text-foreground no-underline', focusRing)}
        >
          <LogoMark size={MOBILE_MARK} className="block shrink-0" />
          <span
            aria-hidden
            className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding] duration-300 ease-decelerate motion-reduce:transition-none"
            style={{
              maxWidth: compact ? 0 : 150,
              paddingLeft: compact ? 0 : 10,
              opacity: compact ? 0 : 1,
            }}
          >
            <span className="h-5 w-px shrink-0 bg-border" />
            <span className="font-mono text-mono-sm font-semibold tracking-[0.08em]">
              SALMAN SAYYED
            </span>
          </span>
        </Link>
        <div className="flex items-center">
          <Button
            asChild
            variant="inverse"
            className="h-9 overflow-hidden whitespace-nowrap transition-[max-width,padding,margin,opacity] duration-300 ease-decelerate"
            style={{
              maxWidth: compact ? 0 : 100,
              paddingInline: compact ? 0 : 12,
              marginRight: compact ? 0 : 8,
              opacity: compact ? 0 : 1,
            }}
          >
            <a href="#contact" tabIndex={compact ? -1 : 0} aria-hidden={compact || undefined}>
              Contact
            </a>
          </Button>
          <MobileMenu
            active="home"
            triggerClassName={cn(
              'transition-[border-radius,background-color,border-color] duration-300',
              compact && 'rounded-[20px] border-transparent bg-transparent',
            )}
          />
        </div>
      </nav>
    </header>
  );
}
