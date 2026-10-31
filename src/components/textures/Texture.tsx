import type { CSSProperties } from 'react';
import { cn } from '@salman8797/component-library/utils';

import { textures } from '@/lib/textures';

type TextureProps = {
  kind: keyof typeof textures;
  /** Positioning, size, colour (a `bg-*` token) and opacity classes. */
  className?: string;
  /** Mask tile size, e.g. "64px 100%" (stretch a ramp) or "64px 64px". */
  tile?: string;
  /** Extra fade so the texture dissolves toward one edge. */
  fade?: 'up' | 'down' | 'radial' | 'none';
};

const fades = {
  up: 'linear-gradient(to top, #000 0%, transparent 100%)',
  down: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
  radial: 'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, #000 100%)',
  none: 'linear-gradient(#000, #000)',
};

/**
 * Decorative texture layer. The SVG is a mask, so the colour is whatever `bg-*`
 * token the caller sets; nothing here hard-codes a colour.
 */
export function Texture({ kind, className, tile, fade = 'up' }: TextureProps) {
  const size = tile ?? (kind === 'ditherRamp' ? '64px 100%' : kind === 'chevrons' ? '48px 24px' : '64px 64px');
  const style: CSSProperties = {
    maskImage: `${textures[kind]}, ${fades[fade]}`,
    WebkitMaskImage: `${textures[kind]}, ${fades[fade]}`,
    maskSize: `${size}, 100% 100%`,
    WebkitMaskSize: `${size}, 100% 100%`,
    maskRepeat: 'repeat, no-repeat',
    WebkitMaskRepeat: 'repeat, no-repeat',
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
    maskPosition: 'left bottom, center',
    WebkitMaskPosition: 'left bottom, center',
  };
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute z-0', className)}
      style={style}
    />
  );
}
