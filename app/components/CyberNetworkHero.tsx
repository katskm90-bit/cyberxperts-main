"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Cinematic, asymmetrical network topology — not a sphere or globe.
// Three depth layers of scattered nodes, connecting lines that slowly
// evolve, data packets travelling along active connections, occasional
// scanning pulses, and subtle parallax driven by mouse movement.
//
// Colour palette per brief: background transparent (page is #050505),
// blue #1D4ED8 dominant, red #DC2626 reserved for anomaly/alert signals,
// white #F5F5F5 for occasional bright highlights.

const BLUE = new THREE.Color("#1D4ED8");
const BLUE_BRIGHT = new THREE.Color("#5B8DEF");
const RED = new THREE.Color("#DC2626");
const WHITE = new THREE.Color("#F5F5F5");

type LayerConfig = {
  z: number;
  count: number;
  spreadX: number;
  spreadY: number;
  driftSpeed: number;
  parallax: number;
  linkDistance: number;
  maxLinksPerNode: number;
};

function buildLayerConfigs(mobile: boolean): LayerConfig[] {
  const scale = mobile ? 0.4 : 1;
  return [
    { z: 1.6, count: Math.round(55 * scale), spreadX: 4.6, spreadY: 2.6, driftSpeed: 0.06, parallax: 1.5, linkDistance: 1.15, maxLinksPerNode: 2 },
    { z: 0, count: Math.round(85 * scale), spreadX: 5.6, spreadY: 3.2, driftSpeed: 0.035, parallax: 0.9, linkDistance: 0.95, maxLinksPerNode: 3 },
    { z: -2.2, count: Math.round(65 * scale), spreadX: 6.6, spreadY: 3.6, driftSpeed: 0.02, parallax: 0.45, linkDistance: 1.05, maxLinksPerNode: 2 },
  ];
}

export default function CyberNetworkHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const container: HTMLDivElement = containerEl;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const layerConfigs = buildLayerConfigs(isMobile);

    type NodeData = { base: THREE.Vector3; offset: THREE.Vector3; targetOffset: THREE.Vector3; anomaly: boolean };
    type LayerRuntime = {
      config: LayerConfig;
      group: THREE.Group;
      nodes: NodeData[];
      pointsGeom: THREE.BufferGeometry;
      points: THREE.Points;
      lineGeom: THREE.BufferGeometry;
      lines: THREE.LineSegments;
      connections: [number, number][];
    };

    const layers: LayerRuntime[] = [];

    function randomAsymmetric(spread: number) {
      // Skewed distribution: biases toward one side for an organic, non-uniform field
      const u = Math.random();
      const v = Math.random();
      const skew = Math.pow(u, 1.4) * (v > 0.5 ? 1 : -1);
      return skew * spread;
    }

    function computeConnections(nodes: NodeData[], linkDistance: number, maxLinks: number): [number, number][] {
      const conns: [number, number][] = [];
      const linkCounts = new Array(nodes.length).fill(0);
      for (let i = 0; i < nodes.length; i++) {
        if (linkCounts[i] >= maxLinks) continue;
        let bestJ = -1;
        let bestDist = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (i === j || linkCounts[j] >= maxLinks) continue;
          const dist = nodes[i].base.distanceTo(nodes[j].base);
          if (dist < linkDistance && dist < bestDist) {
            bestDist = dist;
            bestJ = j;
          }
        }
        if (bestJ !== -1) {
          conns.push([i, bestJ]);
          linkCounts[i]++;
          linkCounts[bestJ]++;
        }
      }
      return conns;
    }

    for (const config of layerConfigs) {
      const group = new THREE.Group();
      group.position.z = config.z;
      rootGroup.add(group);

      const nodes: NodeData[] = Array.from({ length: config.count }, () => {
        const base = new THREE.Vector3(randomAsymmetric(config.spreadX), randomAsymmetric(config.spreadY), (Math.random() - 0.5) * 0.6);
        return { base, offset: new THREE.Vector3(), targetOffset: new THREE.Vector3(), anomaly: Math.random() < 0.02 };
      });

      const connections = computeConnections(nodes, config.linkDistance, config.maxLinksPerNode);

      const positions = new Float32Array(nodes.length * 3);
      const colors = new Float32Array(nodes.length * 3);
      nodes.forEach((n, i) => {
        positions[i * 3] = n.base.x;
        positions[i * 3 + 1] = n.base.y;
        positions[i * 3 + 2] = n.base.z;
        const c = n.anomaly ? RED : Math.random() < 0.06 ? WHITE : BLUE_BRIGHT;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      });

      const pointsGeom = new THREE.BufferGeometry();
      pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pointsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const pointsMat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
      const points = new THREE.Points(pointsGeom, pointsMat);
      group.add(points);

      const linePositions = new Float32Array(connections.length * 6);
      connections.forEach(([a, b], i) => {
        linePositions[i * 6] = nodes[a].base.x;
        linePositions[i * 6 + 1] = nodes[a].base.y;
        linePositions[i * 6 + 2] = nodes[a].base.z;
        linePositions[i * 6 + 3] = nodes[b].base.x;
        linePositions[i * 6 + 4] = nodes[b].base.y;
        linePositions[i * 6 + 5] = nodes[b].base.z;
      });
      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.22 });
      const lines = new THREE.LineSegments(lineGeom, lineMat);
      group.add(lines);

      layers.push({ config, group, nodes, pointsGeom, points, lineGeom, lines, connections });
    }

    // Data packets: small bright points travelling along active connections
    const maxPackets = isMobile ? 10 : 26;
    type Packet = { layerIdx: number; connIdx: number; t: number; speed: number; color: THREE.Color };
    const packets: Packet[] = [];
    function spawnPacket(): Packet | null {
      const layerIdx = Math.floor(Math.random() * layers.length);
      const layer = layers[layerIdx];
      if (layer.connections.length === 0) return null;
      const connIdx = Math.floor(Math.random() * layer.connections.length);
      const isAnomaly = Math.random() < 0.08;
      return { layerIdx, connIdx, t: 0, speed: 0.15 + Math.random() * 0.25, color: isAnomaly ? RED : Math.random() < 0.3 ? WHITE : BLUE_BRIGHT };
    }
    for (let i = 0; i < maxPackets; i++) {
      const p = spawnPacket();
      if (p) packets.push(p);
    }
    const packetPositions = new Float32Array(maxPackets * 3);
    const packetColors = new Float32Array(maxPackets * 3);
    const packetGeom = new THREE.BufferGeometry();
    packetGeom.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    packetGeom.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));
    const packetMat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true });
    const packetPoints = new THREE.Points(packetGeom, packetMat);
    rootGroup.add(packetPoints);

    // Scanning pulses (radar-style rings), spawned periodically
    type Pulse = { mesh: THREE.Mesh; t: number; duration: number };
    let pulses: Pulse[] = [];
    const pulseRingGeom = new THREE.RingGeometry(1, 1.03, 48);
    function spawnPulse() {
      if (reducedMotion || pulses.length > 4) return;
      const layer = layers[Math.floor(Math.random() * layers.length)];
      const node = layer.nodes[Math.floor(Math.random() * layer.nodes.length)];
      const isAlert = Math.random() < 0.15;
      const mat = new THREE.MeshBasicMaterial({
        color: isAlert ? RED : BLUE,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(pulseRingGeom, mat);
      mesh.position.copy(node.base);
      mesh.position.z += layer.group.position.z;
      mesh.scale.setScalar(0.05);
      rootGroup.add(mesh);
      pulses.push({ mesh, t: 0, duration: 2.2 + Math.random() * 0.8 });
    }

    function resize() {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    resize();

    // Mouse parallax (desktop only — no-op on touch devices since no pointermove fires)
    const mouseTarget = { x: 0, y: 0 };
    function handlePointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    window.addEventListener("pointermove", handlePointerMove);

    let running = true;
    let frameId = 0;
    let elapsed = 0;
    let lastEvolve = 0;
    let lastPulse = 0;
    const clock = new THREE.Clock();

    function evolveTopology() {
      // Slowly nudge each node's target offset — organic, non-spinning evolution
      for (const layer of layers) {
        for (const n of layer.nodes) {
          n.targetOffset.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3);
        }
      }
    }
    evolveTopology();

    function animate() {
      if (!running) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;

      if (!reducedMotion) {
        // Smooth mouse follow
        const currentMouse = { x: mouseTarget.x, y: mouseTarget.y };

        for (const layer of layers) {
          // Node drift toward evolving target offset
          const posAttr = layer.pointsGeom.getAttribute("position") as THREE.BufferAttribute;
          layer.nodes.forEach((n, i) => {
            n.offset.lerp(n.targetOffset, delta * layer.config.driftSpeed);
            posAttr.setXYZ(i, n.base.x + n.offset.x, n.base.y + n.offset.y, n.base.z + n.offset.z);
          });
          posAttr.needsUpdate = true;

          // Parallax: rotate each layer group slightly based on mouse, near layers more than far
          const targetRotY = currentMouse.x * 0.09 * layer.config.parallax;
          const targetRotX = -currentMouse.y * 0.06 * layer.config.parallax;
          layer.group.rotation.y += (targetRotY - layer.group.rotation.y) * 0.04;
          layer.group.rotation.x += (targetRotX - layer.group.rotation.x) * 0.04;
        }

        // Update packets
        packets.forEach((p, i) => {
          p.t += delta * p.speed;
          if (p.t >= 1) {
            const next = spawnPacket();
            if (next) packets[i] = next;
            else p.t = 0;
            return;
          }
          const layer = layers[p.layerIdx];
          const [aIdx, bIdx] = layer.connections[p.connIdx] ?? [0, 0];
          const a = layer.nodes[aIdx];
          const b = layer.nodes[bIdx];
          if (!a || !b) return;
          const x = a.base.x + a.offset.x + (b.base.x + b.offset.x - (a.base.x + a.offset.x)) * p.t;
          const y = a.base.y + a.offset.y + (b.base.y + b.offset.y - (a.base.y + a.offset.y)) * p.t;
          const z = a.base.z + a.offset.z + (b.base.z + b.offset.z - (a.base.z + a.offset.z)) * p.t + layer.config.z;
          packetPositions[i * 3] = x;
          packetPositions[i * 3 + 1] = y;
          packetPositions[i * 3 + 2] = z;
          packetColors[i * 3] = p.color.r;
          packetColors[i * 3 + 1] = p.color.g;
          packetColors[i * 3 + 2] = p.color.b;
        });
        packetGeom.getAttribute("position").needsUpdate = true;
        packetGeom.getAttribute("color").needsUpdate = true;

        // Update pulses
        pulses.forEach((p) => {
          p.t += delta;
          const progress = p.t / p.duration;
          const scale = 0.05 + progress * 2.4;
          p.mesh.scale.setScalar(scale);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - progress);
        });
        pulses = pulses.filter((p) => {
          const done = p.t >= p.duration;
          if (done) {
            rootGroup.remove(p.mesh);
            (p.mesh.material as THREE.Material).dispose();
          }
          return !done;
        });

        // Periodic topology evolution (every ~7s) and pulse spawns (every ~2.5s)
        if (elapsed - lastEvolve > 7) {
          evolveTopology();
          lastEvolve = elapsed;
        }
        if (elapsed - lastPulse > 2.5) {
          spawnPulse();
          lastPulse = elapsed;
        }

        // Very slow overall drift of the whole scene for a "living" feel, not spinning
        rootGroup.rotation.y = Math.sin(elapsed * 0.03) * 0.04;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => resize();
    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta(); // reset delta accumulation after being hidden
        animate();
      } else {
        cancelAnimationFrame(frameId);
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);

      pulseRingGeom.dispose();
      packetGeom.dispose();
      packetMat.dispose();
      pulses.forEach((p) => {
        rootGroup.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
      });
      layers.forEach((layer) => {
        layer.pointsGeom.dispose();
        (layer.points.material as THREE.Material).dispose();
        layer.lineGeom.dispose();
        (layer.lines.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
