"use client";

import { useEffect, useRef } from "react";
import { onIntroReveal } from "@/lib/intro";

const SRC = "/photo.jpg";
const BASE_BLOCKS = 26; // resting pixelation (px cols across the image)
const START_BLOCKS = 5; // how blocky it starts before the intro resolves it

// The portrait rendered as chunky pixels; a sharp, saturated copy is revealed
// inside a circle that tracks the cursor.
export default function HeroPixelFace() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sharpRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || window.innerWidth < 768) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const img = new Image();
    img.src = SRC;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;

    let w = 0;
    let h = 0;
    let blocks = START_BLOCKS;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = () => {
      if (!img.complete || !img.naturalWidth || !w) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      // cover-fit
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = h;
        dw = h * ir;
      } else {
        dw = w;
        dh = w / ir;
      }
      dx = (w - dw) / 2;
      dy = (h - dh) / 2;

      const tw = Math.max(2, Math.round(blocks));
      const th = Math.max(2, Math.round(blocks / ir));
      off.width = tw;
      off.height = th;
      octx.clearRect(0, 0, tw, th);
      octx.drawImage(img, 0, 0, tw, th);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, dx, dy, dw, dh);
    };

    img.onload = () => {
      resize();
      draw();
    };
    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    // resolve from very blocky to the resting pixelation once the intro fires
    onIntroReveal(() => {
      const t0 = performance.now();
      const dur = 1100;
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        blocks = START_BLOCKS + (BASE_BLOCKS - START_BLOCKS) * eased;
        draw();
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });

    // sharp copy is only mounted while the cursor is actually over the portrait,
    // so it never adds a masked-layer composite cost during scroll
    const sharp = sharpRef.current;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (sharp) sharp.style.display = inside ? "block" : "none";
      if (inside) {
        wrap.style.setProperty("--mx", `${e.clientX - r.left}px`);
        wrap.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute right-[2vw] top-1/2 hidden aspect-[4/5] h-[70vh] -translate-y-1/2 overflow-hidden rounded-xl md:block"
      style={{ ["--mx" as string]: "-200px", ["--my" as string]: "-200px" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <img
        ref={sharpRef}
        src={SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover [filter:saturate(1.25)_contrast(1.05)]"
        style={{
          maskImage:
            "radial-gradient(circle 150px at var(--mx) var(--my), #000 22%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle 150px at var(--mx) var(--my), #000 22%, transparent 68%)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 120% at 70% 20%, transparent 32%, rgba(10,10,11,0.9) 100%)",
        }}
      />
    </div>
  );
}
