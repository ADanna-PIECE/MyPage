import { gsap } from "gsap";

// Sweeps a panel up to cover the screen, then navigates. The destination page's
// <Loader> continues the sweep upward to reveal it.
export function curtainThenGo(href: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.location.href = href;
    return;
  }
  const c = document.createElement("div");
  c.style.cssText =
    "position:fixed;inset:0;z-index:210;background:var(--background);transform:translateY(100%);will-change:transform";
  document.body.appendChild(c);
  gsap.to(c, {
    y: 0,
    duration: 0.5,
    ease: "power4.inOut",
    onComplete: () => {
      window.location.href = href;
    },
  });
}
