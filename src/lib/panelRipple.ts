import { gsap } from "gsap";

// Drives the shared SVG displacement filter defined in the layout. On hover a
// project panel gets a liquid ripple; on leave it settles back to flat.
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function rippleIn(el: HTMLElement) {
  if (reduced) return;
  const disp = document.getElementById("pr-disp");
  if (!disp) return;
  el.style.filter = "url(#panel-ripple)";
  el.style.willChange = "filter";
  gsap.to(disp, {
    attr: { scale: 32 },
    duration: 0.55,
    ease: "power2.out",
    overwrite: "auto",
  });
}

export function rippleOut(el: HTMLElement) {
  if (reduced) return;
  const disp = document.getElementById("pr-disp");
  if (!disp) return;
  gsap.to(disp, {
    attr: { scale: 0 },
    duration: 0.45,
    ease: "power2.in",
    overwrite: "auto",
    onComplete: () => {
      el.style.filter = "";
      el.style.willChange = "";
    },
  });
}
