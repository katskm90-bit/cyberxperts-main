"use client";

import { useEffect, useRef } from "react";

// Persistent, sitewide animated network texture — nodes, connecting lines,
// and occasional "data pulse" traces along a line. Plain Canvas 2D, no
// Three.js: this is a small set of drawn shapes, not a 3D scene, so a full
// WebGL renderer would only add bundle weight for no visual gain here.
//
// Lives once in app/layout.tsx, outside {children}, so Next.js's App
// Router never remounts it on client-side navigation — it just keeps
// running underneath whichever page is currently showing.

type Node = { x: number; y: number; vx: number; vy: number };
type Pulse = { fromIdx: number; toIdx: number; t: number; speed: number; color: string };

const NAVY = "13, 74, 168";
const RED = "196, 30, 45";
const NODE_COUNT_DESKTOP = 46;
const NODE_COUNT_MOBILE = 22;
const LINK_DISTANCE = 190;

export default function GlobalCyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctx2d;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let animationId = 0;
    let running = true;

    function seedNodes() {
      const count = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
      pulses = [];
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    }

    function maybeSpawnPulse() {
      if (pulses.length > 5 || Math.random() > 0.01) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let nearest = -1;
      let nearestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].x - nodes[fromIdx].x;
        const dy = nodes[i].y - nodes[fromIdx].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE && dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      }
      if (nearest !== -1) {
        pulses.push({
          fromIdx,
          toIdx: nearest,
          t: 0,
          speed: 0.012 + Math.random() * 0.01,
          color: Math.random() > 0.5 ? NAVY : RED,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Drift nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Connecting lines
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.16;
            ctx.strokeStyle = `rgba(${NAVY}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NAVY}, 0.45)`;
        ctx.fill();
      }

      // Data pulses travelling along a line
      if (!reducedMotion) maybeSpawnPulse();
      pulses = pulses.filter((p) => p.t < 1);
      for (const p of pulses) {
        p.t += p.speed;
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) continue;
        const x = from.x + (to.x - from.x) * p.t;
        const y = from.y + (to.y - from.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.7)`;
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      draw();
      animationId = requestAnimationFrame(loop);
    }

    resize();

    if (reducedMotion) {
      draw(); // one static frame, no animation loop
    } else {
      loop();
    }

    const handleResize = () => resize();
    const handleVisibility = () => {
      running = !document.hidden && !reducedMotion;
      if (running) loop();
      else cancelAnimationFrame(animationId);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}
