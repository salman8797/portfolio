// Canvas and WebGL can't use CSS variables, so they read the library tokens once at runtime.

export type RGB = [number, number, number];

function parseColor(value: string): RGB | null {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
  }
  const rgb = v.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

/** Resolve a CSS custom property on <html> to RGB, e.g. tokenRgb('--primary'). */
export function tokenRgb(name: string, fallback: RGB): RGB {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseColor(raw) ?? fallback;
}

export const rgbCss = ([r, g, b]: RGB, a = 1) => `rgb(${r} ${g} ${b} / ${a})`;
