"use client";

import { useEffect, useState } from "react";

// Sharp cut-out portrait standing at the bottom-right of the hero, with a soft
// accent glow behind it. Renders nothing until /photo-cutout.png actually loads.
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
      className="pointer-events-none absolute bottom-0 right-[1vw] hidden h-[70vh] w-[24vw] max-w-[360px] md:block lg:right-[2vw]"
      aria-hidden="true"
    >
      <span className="absolute inset-x-2 bottom-0 -z-10 h-2/3 rounded-[45%] bg-[var(--accent-soft)] blur-[70px]" />
      <img
        src="/photo-cutout.png"
        alt=""
        className="hero-portrait-img absolute bottom-0 right-0 h-full w-full object-contain object-bottom outline-none [filter:saturate(1.05)_contrast(1.02)]"
        style={{ outline: "none" }}
      />
    </div>
  );
}
