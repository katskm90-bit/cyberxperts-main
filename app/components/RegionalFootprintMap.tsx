"use client";

import { useState } from "react";
import { locations, internationalEngagement, type Location } from "@/lib/engagements-data";
import { SOUTH_AFRICA_PATH, SOUTH_AFRICA_VIEWBOX } from "@/lib/south-africa-outline";

// A real South Africa outline (see lib/south-africa-outline.ts for the
// data source and projection notes), with markers positioned using actual
// city coordinates projected onto the same map.
//
// IMPORTANT: the path, connection lines, AND markers all live inside the
// SAME <svg> element, using the same 0–1000 coordinate space. Location
// data stores x/y as percentages (0–100) for readability, converted to
// SVG units (×10) here. This is deliberate: an earlier version positioned
// markers as separate HTML elements using CSS percentages against the
// outer container, which broke as soon as the container's aspect ratio
// didn't match the SVG's square viewBox (the map gets letterboxed inside
// a non-square box, so a "60%" CSS position and a "60%" SVG position land
// in different places). Keeping everything in one coordinate space inside
// one SVG makes this impossible to get out of sync again.

const HQ = { x: 68.65, y: 26.78 }; // Johannesburg/Sandton, the anchor point
const VB_SIZE = 1000; // matches SOUTH_AFRICA_VIEWBOX "0 0 1000 1000"

function toSvg(pct: number): number {
  return (pct / 100) * VB_SIZE;
}

export default function RegionalFootprintMap() {
  const [activeId, setActiveId] = useState<string>(locations[0].id);
  const active: Location = locations.find((l) => l.id === activeId) ?? locations[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden border border-border-dark bg-bg-secondary sm:aspect-[16/10]">
        <svg viewBox={SOUTH_AFRICA_VIEWBOX} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          <path
            d={SOUTH_AFRICA_PATH}
            fill="var(--accent-navy)"
            fillOpacity="0.28"
            fillRule="evenodd"
            stroke="var(--accent-navy-bright)"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Connection lines from HQ to each location */}
          {locations.map((loc) => (
            <line
              key={loc.id}
              x1={toSvg(HQ.x)}
              y1={toSvg(HQ.y)}
              x2={toSvg(loc.x)}
              y2={toSvg(loc.y)}
              stroke={loc.id === activeId ? "var(--accent-red-bright)" : "var(--accent-navy-bright)"}
              strokeWidth={loc.id === activeId ? 2.2 : 1.1}
              opacity={loc.id === activeId ? 0.9 : 0.35}
            />
          ))}

          {/* HQ marker */}
          <circle cx={toSvg(HQ.x)} cy={toSvg(HQ.y)} r="9" fill="var(--accent-gold)" opacity="0.25" />
          <circle cx={toSvg(HQ.x)} cy={toSvg(HQ.y)} r="5" fill="var(--accent-gold)" />

          {/* Location markers — real <circle>/<text>, same coordinate space as the path above */}
          {locations.map((loc) => {
            const isActive = loc.id === activeId;
            const cx = toSvg(loc.x);
            const cy = toSvg(loc.y);
            return (
              <g
                key={loc.id}
                onClick={() => setActiveId(loc.id)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${loc.name} — ${loc.engagements.length} engagement${loc.engagements.length > 1 ? "s" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveId(loc.id);
                }}
              >
                {/* Invisible larger hit area so small markers stay easy to tap on mobile */}
                <circle cx={cx} cy={cy} r="16" fill="transparent" />
                {isActive && <circle cx={cx} cy={cy} r="12" fill="var(--accent-red)" opacity="0.25" />}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 7 : 4.5}
                  fill={isActive ? "var(--accent-red-bright)" : "var(--accent-navy-bright)"}
                  className="transition-all"
                />
                <text
                  x={cx}
                  y={cy + 18}
                  textAnchor="middle"
                  className={`pointer-events-none select-none font-mono uppercase tracking-wide transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
                  fontSize="13"
                  fill="var(--ink-primary)"
                >
                  {loc.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div className="border border-border-dark bg-bg-secondary p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-navy-bright">
          {active.name}, {active.country}
        </p>
        <p className="mt-1 font-body text-xs text-ink-faint">
          {active.engagements.length} engagement{active.engagements.length > 1 ? "s" : ""}
        </p>

        <div className="mt-5 flex flex-col gap-5 max-h-[420px] overflow-y-auto pr-1">
          {active.engagements.map((e, i) => (
            <div key={`${e.client}-${i}`} className="border-t border-border-dark pt-4 first:border-t-0 first:pt-0">
              <p className="font-display text-sm font-bold text-ink-primary">{e.client}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-ink-muted">{e.engagement}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-sm bg-bg-tertiary px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-accent-navy-bright">
                  {e.service}
                </span>
                <span className="rounded-sm bg-bg-tertiary px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  {e.industry}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-border-dark pt-4 font-body text-xs leading-relaxed text-ink-faint">
          Cyberxperts has also delivered {internationalEngagement.engagements.length} engagements for{" "}
          {internationalEngagement.client}, headquartered in {internationalEngagement.location} — outside this
          map&apos;s regional scope.
        </p>
      </div>
    </div>
  );
}
