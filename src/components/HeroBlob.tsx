"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vView;

//  Simplex 3D noise by Stefan Gustavson / Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main(){
  float n = snoise(normal * 1.6 + uTime * 0.28);
  vec3 displaced = position + normal * n * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uAccent;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float f = 1.0 - max(dot(vNormal, vView), 0.0);
  float rim = pow(f, 2.6);
  float edge = pow(f, 7.0);
  vec3 base = mix(vec3(0.03, 0.025, 0.045), uAccent * 0.5, rim);
  base += uAccent * rim * 0.8;
  base += vec3(0.75, 0.7, 0.95) * edge * 0.9;
  gl_FragColor = vec4(base, 1.0);
}
`;

export default function HeroBlob() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const accentStr =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#8b5cf6";
    const accent = new THREE.Color(accentStr);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.15 },
      uAccent: { value: accent },
    };
    const geo = new THREE.IcosahedronGeometry(1.35, 42);
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const size = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0, amp: 0.18 };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const dt = clock.getDelta();
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      const near = Math.min(1, Math.hypot(target.x - cur.x, target.y - cur.y) * 3);
      cur.amp += (0.15 + near * 0.13 - cur.amp) * 0.08;

      uniforms.uTime.value += reduced ? 0 : dt;
      uniforms.uAmp.value = cur.amp;
      mesh.rotation.y += (reduced ? 0 : dt * 0.15) + cur.x * 0.02;
      mesh.rotation.x = cur.y * 0.35;
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
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      className="pointer-events-none absolute right-[-8vw] top-1/2 hidden h-[62vh] w-[62vh] -translate-y-1/2 md:block lg:right-[2vw]"
      aria-hidden="true"
    />
  );
}
