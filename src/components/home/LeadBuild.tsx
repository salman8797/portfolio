'use client';

import { useState } from 'react';
import { Card, SectionLabel, SegmentedControl } from '@salman8797/component-library';
import { cn } from '@salman8797/component-library/utils';

import { modes } from '@/content/site';

type Mode = 'lead' | 'build';

const tagClass = 'font-mono text-mono-sm tracking-[0.08em] text-primary';
const cardClass = 'animate-rise border-border bg-card/82';
const delays = ['0ms', '60ms', '120ms'];

function CodeSample() {
  return (
    <pre className="m-0 mt-auto overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-mono text-muted-foreground">
      <span className="text-primary">export const</span> <span className="text-foreground">Button</span> = (
      {'{'} variant = <span className="text-highlight">&apos;primary&apos;</span>, ...props {'}'}:{' '}
      <span className="text-foreground">ButtonProps</span>) =&gt; ({'\n'}
      {'  '}&lt;<span className="text-primary">button</span> className={'{'}button({'{'} variant {'}'}){'}'}{' '}
      {'{'}...props{'}'} /&gt;{'\n'})
    </pre>
  );
}

/** "02 — Lead / Build": one toggle, two sets of cards, and a giant outlined watermark. */
export function LeadBuild() {
  const [mode, setMode] = useState<Mode>('lead');
  const cards = modes[mode];

  return (
    <section
      aria-labelledby="modes-title"
      className="relative overflow-hidden border-b border-border pt-12 pb-24 md:pt-16 md:pb-32"
    >
      {/* Watermark: the active mode's word, outlined, bottom right. */}
      {(['lead', 'build'] as const).map((m) => (
        <span
          key={m}
          aria-hidden
          className="text-outline pointer-events-none absolute -right-10 -bottom-[104px] z-0 hidden text-[360px] leading-none font-bold tracking-[-0.05em] transition-opacity duration-500 ease-standard md:block"
          style={{
            opacity: mode === m ? 0.75 : 0,
            WebkitTextStroke: '2px color-mix(in srgb, var(--foreground) 6%, transparent)',
          }}
        >
          {m.toUpperCase()}
        </span>
      ))}

      <SectionLabel index="02" className="gutter-l relative z-[1] gap-3 md:gap-4">
        Lead / Build
      </SectionLabel>

      <div className="relative z-[1] mx-auto flex max-w-[1280px] flex-col gap-6 px-4 pt-8 md:gap-10 md:px-8 md:pt-12">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="modes-title" className="m-0 text-h2 md:text-h1">
              Hands-on builder. Team lead.
            </h2>
            <p className="m-0 text-body text-muted-foreground md:text-body-lg">
              Switch the view to see what I bring in each role.
            </p>
          </div>
          <SegmentedControl
            label="Highlight view"
            variant="accent"
            size="lg"
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
            items={[
              { value: 'lead', label: 'LEAD' },
              { value: 'build', label: 'BUILD' },
            ]}
            className="w-full md:w-fit"
            segmentClassName="h-11 font-mono text-body-sm font-semibold tracking-[0.08em] md:h-10"
          />
        </div>

        <div aria-live="polite">
          {mode === 'lead' ? (
            <div key="lead" className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
              {cards.map((c, i) => (
                <Card
                  key={c.tag}
                  className={cardClass}
                  style={{ animationDelay: delays[i] }}
                  contentClassName="flex h-full flex-col gap-2 p-5 md:min-h-[220px] md:gap-3 md:p-6"
                >
                  <span className={tagClass}>{c.tag}</span>
                  <h3 className="m-0 text-h4 md:mt-auto md:text-h3">{c.title}</h3>
                  <p className="m-0 text-body-sm text-muted-foreground">{c.body}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div key="build" className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
              {cards.map((c, i) => (
                <Card
                  key={c.tag}
                  className={cn(cardClass, i === 0 && 'border-cl-lavender-600 md:col-span-2 md:row-span-2 md:border-border')}
                  style={{ animationDelay: delays[i] }}
                  contentClassName="flex h-full flex-col gap-2 p-5 md:gap-3 md:p-6"
                >
                  <span className={tagClass}>{c.tag}</span>
                  <h3 className="m-0 text-h4 md:text-h3">{c.title}</h3>
                  <p className="m-0 max-w-[520px] text-body-sm text-muted-foreground">{c.body}</p>
                  {i === 0 ? (
                    <div className="hidden h-full flex-col md:flex">
                      <CodeSample />
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
