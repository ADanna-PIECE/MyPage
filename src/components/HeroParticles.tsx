"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// A field of particles that settles into the "AD" monogram and scatters,
// flowing, when the cursor passes through it.
export default function HeroParticles() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
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
    const stride = 2;
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
      const rad = 1.6 + Math.random() * 1.8;
      positions[i * 3] = Math.cos(a) * rad;
      positions[i * 3 + 1] = Math.sin(a) * rad;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(accentStr),
      size: 0.026,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
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
        let px = pos[j] + (hx - pos[j]) * 0.11;
        let py = pos[j + 1] + (hy - pos[j + 1]) * 0.11;
        let pz = pos[j + 2] + (home[j + 2] - pos[j + 2]) * 0.11;

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
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
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
      className="pointer-events-none absolute right-[-6vw] top-1/2 hidden h-[68vh] w-[52vw] -translate-y-1/2 md:block lg:right-[2vw] lg:w-[42vw]"
      aria-hidden="true"
    />
  );
}
