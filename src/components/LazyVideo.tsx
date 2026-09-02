"use client";

import { useEffect, useRef, useState } from "react";

// Loads the video when it scrolls near the viewport, and only lets it *play*
// while it's actually on (or next to) the screen. In the horizontal Work strip
// that keeps 1–2 videos decoding at a time instead of all five.
export default function LazyVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      // no vertical margin (panels are full-height), small horizontal lead-in
      { rootMargin: "0px 400px 0px 400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={load ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
