'use client';

import { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { Button, CopyButton, SectionLabel, StatusDot, usePrefersReducedMotion } from '@salman8797/component-library';

import { Texture } from '@/components/textures/Texture';
import { site } from '@/content/site';

const ghost = 'h-11 bg-background/80 px-4 font-medium hover:bg-secondary';

/** "Get in touch" pill that leans toward the pointer (desktop, motion allowed). */
function MagneticCta() {
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const c = (v: number) => Math.max(-14, Math.min(14, Math.round(v)));
  return (
    <div
      className="flex justify-center px-20 py-6"
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        setOffset({
          x: c((e.clientX - (r.left + r.width / 2)) * 0.18),
          y: c((e.clientY - (r.top + r.height / 2)) * 0.25),
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <Button
        asChild
        size="2xl"
        shape="pill"
        className="shadow-[0_8px_24px_rgb(0_0_0/0.35)] transition-[transform,filter] duration-200 ease-standard"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <a href={`mailto:${site.email}`}>
          Get in touch<span aria-hidden>→</span>
        </a>
      </Button>
    </div>
  );
}

/** "09 — Contact". */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-border pt-12 pb-40 lg:pt-16 lg:pb-48"
    >
      <Texture
        kind="ditherRamp"
        tile="64px 100%"
        className="inset-x-0 bottom-0 h-[78%] bg-cl-border-500 opacity-70"
      />
      <SectionLabel index="09" className="gutter-l relative z-[1] gap-3 md:gap-4">
        Contact
      </SectionLabel>
      <div className="relative z-[1] mx-auto flex max-w-[1280px] flex-col gap-5 px-4 pt-20 md:px-8 lg:items-center lg:gap-7 lg:pt-32 lg:text-center">
        <span className="inline-flex items-center gap-2 font-mono text-mono-sm tracking-[0.12em] text-muted-foreground lg:text-body-sm lg:font-medium">
          <StatusDot pulse />
          AVAILABLE · IMMEDIATE JOINER
        </span>
        <h2
          id="contact-title"
          className="m-0 text-[48px] leading-[52px] font-bold tracking-[-0.03em] lg:text-[64px] lg:leading-[68px] lg:tracking-[-0.035em]"
        >
          <span className="block text-balance">Need someone who ships end to end?</span>
          <span className="block text-highlight">Let’s talk.</span>
        </h2>
        <p className="m-0 max-w-[560px] text-body-lg text-muted-foreground">
          Hiring for a full stack or frontend-heavy role? Tell me about the product, the team, and the problem. I
          usually reply within 24 hours.
        </p>

        <div className="hidden lg:block">
          <MagneticCta />
        </div>
        <Button asChild size="2xl" shape="pill" fullWidth className="mt-2 shadow-[0_8px_24px_rgb(0_0_0/0.35)] lg:hidden">
          <a href={`mailto:${site.email}`}>
            Get in touch<span aria-hidden>→</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:justify-center">
          <CopyButton
            value={site.email}
            copiedLabel="Copied ✓"
            copiedMessage="Email address copied"
            className={`${ghost} col-span-2 min-w-0 font-mono text-mono-sm lg:text-body-sm lg:font-normal`}
          >
            {site.email}
          </CopyButton>
          <Button asChild variant="outline" className={ghost}>
            <a href={site.linkedin}>LinkedIn</a>
          </Button>
          <Button asChild variant="outline" className={`${ghost} whitespace-nowrap`}>
            <a href={site.resume} download>
              <DownloadIcon aria-hidden />
              Download resume
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
