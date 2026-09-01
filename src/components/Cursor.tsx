"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = dot.current;
    const rg = ring.current;
    const lbl = label.current;
    if (!el || !rg || !lbl) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let tx = x;
    let ty = y;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const over = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        el.dataset.active = "label";
        rg.dataset.active = "label";
        lbl.textContent = labelled.dataset.cursor || "";
      } else if (target?.closest("a, button")) {
        el.dataset.active = "link";
        rg.dataset.active = "link";
        lbl.textContent = "";
      } else {
        el.dataset.active = "false";
        rg.dataset.active = "false";
        lbl.textContent = "";
      }
    };
    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      rx += (tx - rx) * 0.13;
      ry += (ty - ry) * 0.13;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      rg.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.classList.add("has-cursor");
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
    </>
  );
}
