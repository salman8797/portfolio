'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@salman8797/component-library';

/**
 * A shared demo clock: increments every `interval` ms while the tab is visible.
 * Frozen at 0 under reduced motion, so demos show their settled state.
 */
export function useTick(interval = 1200) {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval, reduced]);

  return { tick: reduced ? 0 : tick, reduced };
}
