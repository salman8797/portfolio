import type { ComponentProps } from 'react';

import { MARK_ACCENTS, MARK_GRID } from './logo-grid';

const CELL = 10;
const DOT = 7.5; // square dots at 75% of the cell

const dots = MARK_GRID.flatMap((row, r) =>
  [...row].flatMap((ch, c) => (ch === '#' ? [{ r, c, accent: MARK_ACCENTS.has(`${r},${c}`) }] : [])),
);

type LogoMarkProps = Omit<ComponentProps<'svg'>, 'viewBox'> & {
  /** Rendered height in px; width follows the 16 × 10 grid. */
  size?: number;
};

/** The dot-grid "SS" mark. Dots use currentColor, accents use the primary token. */
export function LogoMark({ size = 32, ...props }: LogoMarkProps) {
  const cols = MARK_GRID[0].length;
  const rows = MARK_GRID.length;
  return (
    <svg
      viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
      height={size}
      width={(size * cols) / rows}
      aria-hidden
      shapeRendering="crispEdges"
      {...props}
    >
      {dots.map(({ r, c, accent }) => (
        <rect
          key={`${r}-${c}`}
          x={c * CELL + (CELL - DOT) / 2}
          y={r * CELL + (CELL - DOT) / 2}
          width={DOT}
          height={DOT}
          fill={accent ? 'var(--primary)' : 'currentColor'}
        />
      ))}
    </svg>
  );
}
