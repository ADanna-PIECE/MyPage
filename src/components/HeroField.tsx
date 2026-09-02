"use client";

import { useEffect, useRef } from "react";

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Node = { ox: number; oy: number; x: number; y: number };

// Animated node network behind the hero. Nodes drift on a wave and link to
// neighbours; near the cursor they pull toward it and light up in the accent.
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const GAP = 72;
    const LINK = GAP * 1.7;
    const REACH = 220;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#8b5cf6";

    let w = 0;
    let h = 0;
    let cols = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * GAP;
          const oy = r * GAP;
          nodes.push({ ox, oy, x: ox, y: oy });
        }
      }
    };
    build();
    window.addEventListener("resize", build);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointerout", onLeave);

    let raf = 0;
    let t = 0;
    let visible = true;
    let last = 0;

    const frame = (now = 0) => {
      if (!reduce && visible) raf = requestAnimationFrame(frame);
      // ponytail: ~40fps cap — the mesh reads the same, but the nested link/node
      // loops stop stealing frame budget from the scroll while you leave the hero
      if (now - last < 24) return;
      last = now;
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        const wave = reduce
          ? 0
          : Math.sin(n.ox * 0.02 + t) * 4 + Math.cos(n.oy * 0.02 + t * 0.8) * 4;
        n.x = n.ox + wave;
        n.y = n.oy + wave * 0.6;
        if (!reduce) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH) {
            const f = 1 - dist / REACH;
            n.x -= (dx / (dist || 1)) * f * 26;
            n.y -= (dy / (dist || 1)) * f * 26;
          }
        }
      }

      // travelling brightness pulse so the mesh always has life
      const pulseX = ((Math.sin(t * 0.35) + 1) / 2) * w;
      const pulseY = ((Math.cos(t * 0.28) + 1) / 2) * h;

      // links to right/down neighbours
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const nb = [nodes[i + 1], nodes[i + cols]];
        for (const b of nb) {
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK) continue;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const md = Math.hypot(mx - mouse.x, my - mouse.y);
          const hot = md < REACH ? 1 - md / REACH : 0;
          const pd = Math.hypot(mx - pulseX, my - pulseY);
          const warm = pd < 260 ? (1 - pd / 260) * 0.5 : 0;
          const glow = Math.max(hot, warm);
          ctx.strokeStyle =
            glow > 0.04
              ? hexToRgba(accent, 0.12 + glow * 0.6)
              : `rgba(255,255,255,${0.08 * (1 - dist / LINK)})`;
          ctx.lineWidth = glow > 0.4 ? 1.3 : 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // nodes
      for (const n of nodes) {
        const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const hot = md < REACH ? 1 - md / REACH : 0;
        const pd = Math.hypot(n.x - pulseX, n.y - pulseY);
        const warm = pd < 260 ? (1 - pd / 260) * 0.6 : 0;
        const glow = Math.max(hot, warm);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4 + glow * 2.6, 0, Math.PI * 2);
        ctx.fillStyle =
          glow > 0.08
            ? hexToRgba(accent, 0.35 + glow * 0.6)
            : "rgba(255,255,255,0.22)";
        ctx.fill();
      }

    };

    frame();

    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage:
          "radial-gradient(115% 120% at 82% 46%, #000 12%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(115% 120% at 82% 46%, #000 12%, transparent 72%)",
      }}
      aria-hidden="true"
    />
  );
}
