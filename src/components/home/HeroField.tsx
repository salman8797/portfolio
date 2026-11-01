'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@salman8797/component-library';

import { tokenRgb, type RGB } from '@/lib/tokens';

export type FieldConfig = {
  /** Mask ellipse that thins the field behind the copy (fractions of the canvas). */
  mcx: number;
  mcy: number;
  mrx: number;
  mry: number;
  /** Noise scale for the WebGL path. */
  scale: number;
  /** 2D fallback: cell size and noise frequency. */
  cell: number;
  sx: number;
  sy: number;
};

export const FIELD_DESKTOP: FieldConfig = {
  cell: 6,
  sx: 0.0021,
  sy: 0.0021,
  mcx: 0.3,
  mcy: 0.56,
  mrx: 0.3,
  mry: 0.36,
  scale: 260,
};

export const FIELD_MOBILE: FieldConfig = {
  cell: 5,
  sx: 0.0042,
  sy: 0.0032,
  mcx: 0.45,
  mcy: 0.3,
  mrx: 0.6,
  mry: 0.2,
  scale: 150,
};

const VERTEX = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

// Domain-warped fbm, quantised to 3 levels with an 8×8 Bayer dither (from the design).
const FRAGMENT = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;uniform float u_t;uniform vec2 u_mouse;uniform float u_mr;uniform vec4 u_mask;uniform float u_scale;
uniform vec3 u_bg;uniform vec3 u_dot;uniform vec3 u_tint;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453);}
float pn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(h2(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(h2(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);}
float fbm(vec2 p){float v=0.0;float a=0.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*pn(p);p=m*p;a*=0.5;}return v;}
float b2(vec2 a){a=floor(a);return fract(a.x/2.0+a.y*a.y*0.75);}
float b4(vec2 a){return b2(0.5*a)*0.25+b2(a);}
float b8(vec2 a){return b4(0.5*a)*0.25+b2(a);}
void main(){
vec2 cell=floor(gl_FragCoord.xy);
vec2 p=cell/u_scale-u_t*vec2(0.010,0.008);
float t=u_t*0.05;
vec2 q=vec2(fbm(p),fbm(p+vec2(5.2,1.3)));
vec2 r=vec2(fbm(p+3.0*q+vec2(1.7,9.2)+0.15*t),fbm(p+3.0*q+vec2(8.3,2.8)+0.126*t));
float v=fbm(p+3.0*r);
float n=0.7*smoothstep(0.45,0.95,clamp(0.5+v*1.25,0.0,1.0));
vec2 d=(cell-u_mask.xy)/u_mask.zw;n*=1.0-0.7*exp(-dot(d,d));
n*=smoothstep(u_mr*0.4,u_mr,distance(cell,u_mouse));
float lv=floor(n*3.0+b8(cell))/3.0;
vec3 tc=mix(u_dot,u_tint,0.4);
float tw=step(0.99,lv)*smoothstep(0.82,1.0,n)*smoothstep(0.25,0.7,length(q));
gl_FragColor=vec4(mix(u_bg,mix(u_dot,tc,tw),lv),1.0);
}`;

const norm = (c: RGB) => c.map((v) => v / 255) as RGB;

// --- 2D canvas fallback (value noise + 4×4 ordered dither) -------------------------

function hash(x: number, y: number) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const fbm2 = (x: number, y: number, t: number) =>
  0.55 * noise(x, y) +
  0.3 * noise(x * 2 + 5.2 + t * 0.02, y * 2 + 1.3) +
  0.15 * noise(x * 4 + 9.1, y * 4 + 7.7 - t * 0.03);

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function drawField2d(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  t: number,
  f: FieldConfig,
  dot: RGB,
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const off = (f.cell - 2) / 2;
  const buckets: number[][] = [[], [], [], []];
  for (let gy = 0, y = 0; y < h; gy++, y += f.cell) {
    for (let gx = 0, x = 0; x < w; gx++, x += f.cell) {
      let v = fbm2(x * f.sx + t * 0.012, y * f.sy + t * 0.007, t);
      v = Math.max(0, Math.min(1, (v - 0.45) / 0.45)) * 0.7;
      const mx = (x - w * f.mcx) / (w * f.mrx);
      const my = (y - h * f.mcy) / (h * f.mry);
      v *= 1 - 0.72 * Math.exp(-(mx * mx + my * my));
      const th = (BAYER[(gy & 3) * 4 + (gx & 3)] + 0.5) / 16;
      if (v <= th) continue;
      buckets[Math.min(3, (v * 4) | 0)].push(x + off, y + off);
    }
  }
  const alphas = [0.14, 0.22, 0.32, 0.44];
  buckets.forEach((pts, b) => {
    ctx.fillStyle = `rgb(${dot[0]} ${dot[1]} ${dot[2]} / ${alphas[b]})`;
    for (let i = 0; i < pts.length; i += 2) ctx.fillRect(pts[i], pts[i + 1], 2, 2);
  });
}

/**
 * Animated dithered noise behind the hero. WebGL when available (with a mouse "hole"
 * that follows the pointer over the parent section), 2D canvas otherwise. Renders one
 * still frame under reduced motion and pauses when off-screen or the tab is hidden.
 */
export function HeroField({ config, className }: { config: FieldConfig; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const bg = tokenRgb('--background', [15, 14, 22]);
    const dot = tokenRgb('--cl-border-600', [86, 81, 112]);
    const tint = tokenRgb('--primary', [174, 135, 237]);
    const soft = tokenRgb('--muted-foreground', [183, 179, 198]);

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true });
    } catch {
      gl = null;
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    if (gl) {
      const mk = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
      };
      const vs = mk(gl.VERTEX_SHADER, VERTEX);
      const fs = mk(gl.FRAGMENT_SHADER, FRAGMENT);
      const prog = vs && fs ? gl.createProgram() : null;
      if (prog && vs && fs) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
      }
      if (!prog || !gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl = null;
      } else {
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const loc = gl.getAttribLocation(prog, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        for (const name of ['res', 't', 'mouse', 'mr', 'mask', 'scale', 'bg', 'dot', 'tint']) {
          uniforms[name] = gl.getUniformLocation(prog, `u_${name}`);
        }
        gl.uniform3fv(uniforms.bg, norm(bg));
        gl.uniform3fv(uniforms.dot, norm(dot));
        gl.uniform3fv(uniforms.tint, norm(tint));
      }
    }
    const ctx2d = gl ? null : cv.getContext('2d');

    let w = 1;
    let h = 1;
    let dpr = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      if (gl) {
        // Half resolution + pixelated scaling gives the chunky dither cells.
        cv.width = Math.max(1, Math.round(w / 2));
        cv.height = Math.max(1, Math.round(h / 2));
        gl.viewport(0, 0, cv.width, cv.height);
      } else {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
    };

    // Pointer hole, eased toward the target.
    let target: { x: number; y: number } | null = null;
    const m = { x: -9999, y: -9999, r: 0 };
    const host = cv.parentElement;
    const onMove = (e: PointerEvent) => {
      if (reducedRef.current || e.pointerType !== 'mouse') return;
      const r = cv.getBoundingClientRect();
      target = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      target = null;
    };
    host?.addEventListener('pointermove', onMove);
    host?.addEventListener('pointerleave', onLeave);

    const paint = (t: number) => {
      if (gl) {
        const red = reducedRef.current;
        const tgt = red ? null : target;
        if (tgt) {
          if (m.r < 1) {
            m.x = tgt.x;
            m.y = tgt.y;
          }
          m.x += (tgt.x - m.x) * 0.2;
          m.y += (tgt.y - m.y) * 0.2;
        }
        m.r += ((tgt ? 70 : 0) - m.r) * (red ? 1 : 0.12);
        const cw = cv.width;
        const ch = cv.height;
        gl.uniform2f(uniforms.res, cw, ch);
        gl.uniform1f(uniforms.t, t);
        gl.uniform2f(uniforms.mouse, m.x / 2, ch - m.y / 2);
        gl.uniform1f(uniforms.mr, Math.max(0.001, m.r));
        gl.uniform4f(uniforms.mask, cw * config.mcx, ch * (1 - config.mcy), cw * config.mrx, ch * config.mry);
        gl.uniform1f(uniforms.scale, config.scale);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        drawField2d(ctx2d, w, h, dpr, t, config, soft);
      }
    };

    const t0 = performance.now();
    let tNow = 0;
    let lastDraw = 0;
    let staticDone = false;
    let frame = 0;
    resize();
    paint(0);
    const ro = new ResizeObserver(() => {
      resize();
      paint(tNow);
    });
    ro.observe(cv);

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (document.hidden || cv.getBoundingClientRect().bottom < 0) return;
      tNow = (now - t0) / 1000;
      if (reducedRef.current) {
        if (!staticDone) {
          staticDone = true;
          paint(tNow);
        }
        return;
      }
      staticDone = false;
      // ~30fps for WebGL, ~12fps for the CPU fallback.
      if (now - lastDraw > (gl ? 33 : 80)) {
        lastDraw = now;
        paint(tNow);
      }
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      host?.removeEventListener('pointermove', onMove);
      host?.removeEventListener('pointerleave', onLeave);
    };
  }, [config]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
    />
  );
}
