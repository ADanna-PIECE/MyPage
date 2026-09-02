"use client";

import { useEffect, useState } from "react";

// Sharp cut-out portrait standing at the bottom-right of the hero, its lower
// edge fading into the dark, with a soft accent glow behind it. Renders
// nothing until /photo-cutout.png actually loads.
export default function HeroPortrait() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setReady(true);
    img.src = "/photo-cutout.png";
  }, []);

  if (!ready) return null;

  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 hidden h-[94vh] w-[38vw] max-w-[540px] md:block"
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 bottom-0 -z-10 h-3/4 rounded-[45%] bg-[var(--accent-soft)] blur-[90px]" />
      <img
        src="/photo-cutout.png"
        alt=""
        className="absolute bottom-0 right-0 h-full w-full object-contain object-bottom [filter:saturate(1.05)_contrast(1.02)]"
        style={{
          outline: "none",
          maskImage: "linear-gradient(to top, transparent 0%, #000 13%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, #000 13%)",
        }}
      />
    </div>
  );
}
