'use client';

import { Button, useIsMobile } from '@salman8797/component-library';

import { hero } from '@/content/site';

import { ArrowLink } from './ArrowLink';
import { FIELD_DESKTOP, FIELD_MOBILE, HeroField } from './HeroField';
import { HeroMorph } from './HeroMorph';

export function Hero() {
  const mobile = useIsMobile();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative -mt-[57px] overflow-hidden border-b border-border bg-background pt-[57px] lg:-mt-[65px] lg:h-[clamp(820px,100vh,960px)] lg:pt-0"
    >
      <HeroField config={mobile ? FIELD_MOBILE : FIELD_DESKTOP} />
      <div className="relative z-10 mx-auto box-border flex h-full max-w-[1280px] flex-col md:px-8 lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:pt-16">
        <div className="flex flex-col justify-center gap-5 px-4 pt-12 pb-2 md:gap-7 md:px-0 lg:pt-24 lg:pb-8">
          <p className="m-0 font-mono text-mono-sm tracking-[0.12em] text-muted-foreground uppercase md:text-body-sm md:font-medium">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="m-0 text-[44px] leading-[48px] font-bold tracking-[-0.03em] text-foreground md:text-[64px] md:leading-[68px] md:tracking-[-0.035em] xl:text-[80px] xl:leading-[84px]"
          >
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="m-0 max-w-[60ch] text-body-lg text-muted-foreground">{hero.lead}</p>
          <div className="flex items-center gap-5 pt-1 md:gap-6 md:pt-2">
            <Button asChild size="xl" className="px-5 md:px-6">
              <a href="#work">View my work</a>
            </Button>
            <ArrowLink href="#contact" className="text-body-lg">
              Contact me
            </ArrowLink>
          </div>
        </div>
        <div className="flex flex-col justify-center px-4 pt-8 pb-10 md:px-0 lg:pt-[72px] lg:pb-10 lg:pl-10">
          <HeroMorph key={mobile ? 'm' : 'd'} layout={mobile ? 'mobile' : 'desktop'} />
        </div>
      </div>
    </section>
  );
}
