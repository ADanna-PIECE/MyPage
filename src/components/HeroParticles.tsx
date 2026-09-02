"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { onIntroReveal } from "@/lib/intro";

// A field of particles that settles into the "AD" monogram and scatters,
// flowing, when the cursor passes through it.
export default function HeroParticles() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    // desktop only, and skip on low-memory devices (node network alone carries mobile)
    const lowEnd =
      "deviceMemory" in navigator &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
    if (window.innerWidth < 768 || lowEnd) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const accentStr =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#8b5cf6";

    // --- sample target positions from the "AD" glyphs -------------------------
    const c = document.createElement("canvas");
    c.width = 260;
    c.height = 180;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.font = "700 150px Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("AD", c.width / 2, c.height / 2 + 6);
    const data = g.getImageData(0, 0, c.width, c.height).data;

    const targets: number[] = [];
    const stride = 3;
    for (let y = 0; y < c.height; y += stride) {
      for (let x = 0; x < c.width; x += stride) {
        if (data[(y * c.width + x) * 4 + 3] > 128) {
          targets.push(
            (x / c.width - 0.5) * 3.6,
            -(y / c.height - 0.5) * 2.5,
            (Math.random() - 0.5) * 0.2,
          );
        }
      }
    }
    const count = targets.length / 3;

    const positions = new Float32Array(count * 3);
    const home = new Float32Array(targets);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 1.3 + Math.random() * 1.3;
      positions[i * 3] = Math.cos(a) * rad;
      positions[i * 3 + 1] = Math.sin(a) * rad;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(accentStr),
      size: 0.024,
      transparent: true,
      opacity: 0.6, // sits around the portrait, not over it
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(1);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.add(points);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.4;

    const size = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height || 1;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    // cursor projected onto the particle plane, clamped so off-screen is inert
    const mouse = new THREE.Vector3(999, 999, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ndc = new THREE.Vector2(999, 999);
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (nx < -1.4 || nx > 1.4 || ny < -1.4 || ny > 1.4) {
        ndc.set(999, 999);
        return;
      }
      ndc.set(nx, ny);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", () => ndc.set(999, 999));

    const pos = geo.attributes.position.array as Float32Array;
    const clock = new THREE.Clock();
    let raf = 0;
    let onScreen = true;
    let near = true;
    let lastFrame = 0;
    let lastScroll = -1e9;
    const running = () => onScreen && near;
    let pull = reduced ? 0.13 : 0.006; // barely drifts until the intro fires

    onIntroReveal(() => {
      gsap.to(
        { p: pull },
        {
          p: 0.13,
          duration: 1.1,
          ease: "power2.out",
          onUpdate() {
            pull = (this.targets()[0] as { p: number }).p;
          },
        },
      );
    });

    const loop = (now = 0) => {
      if (running()) raf = requestAnimationFrame(loop);
      // ~40fps idle, ~22fps while scrolling — it barely moves once settled, so the
      // drop is invisible and it stops competing with Lenis/ScrollTrigger
      if (now - lastFrame < (now - lastScroll < 180 ? 44 : 24)) return;
      lastFrame = now;
      clock.getDelta();
      const t = clock.elapsedTime;

      if (ndc.x < 2) {
        raycaster.setFromCamera(ndc, camera);
        raycaster.ray.intersectPlane(plane, mouse);
      } else {
        mouse.set(999, 999, 0);
      }

      for (let i = 0; i < count; i++) {
        const j = i * 3;
        const hx = home[j] + (reduced ? 0 : Math.sin(t + i) * 0.015);
        const hy = home[j + 1] + (reduced ? 0 : Math.cos(t * 0.8 + i) * 0.015);
        let px = pos[j] + (hx - pos[j]) * pull;
        let py = pos[j + 1] + (hy - pos[j + 1]) * pull;
        let pz = pos[j + 2] + (home[j + 2] - pos[j + 2]) * pull;

        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 0.8) {
          const f = (0.8 - d2) * 0.7;
          const inv = 1 / Math.sqrt(d2 || 0.001);
          px += dx * inv * f;
          py += dy * inv * f;
          pz += f * 0.3;
        }
        pos[j] = px;
        pos[j + 1] = py;
        pos[j + 2] = pz;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = reduced ? 0 : Math.sin(t * 0.15) * 0.12;

      renderer.render(scene, camera);
    };
    loop();

    const wake = () => {
      if (running()) {
        cancelAnimationFrame(raf);
        clock.getDelta();
        raf = requestAnimationFrame(loop);
      }
    };

    // stop the render loop while the hero is scrolled away...
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        wake();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);

    // ...and already once you've scrolled past the first ~60% of it
    const onScroll = () => {
      lastScroll = performance.now();
      const n = window.scrollY < window.innerHeight * 0.6;
      if (n === near) return; // only act when it actually crosses the line
      near = n;
      wake();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      window.removeEventListener("mousemove", onMove);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      className="pointer-events-none absolute right-[-2vw] top-1/2 hidden h-[86vh] w-[58vw] -translate-y-1/2 md:block lg:right-[0vw] lg:w-[50vw]"
      aria-hidden="true"
    />
  );
}
