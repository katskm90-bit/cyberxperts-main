"use client";

import { useState } from "react";
import { locations, internationalEngagement, type Location } from "@/lib/engagements-data";
import { SOUTH_AFRICA_PATH, SOUTH_AFRICA_VIEWBOX } from "@/lib/south-africa-outline";

// A real South Africa outline (see lib/south-africa-outline.ts for the
// data source and projection notes), with markers positioned using actual
// city coordinates projected onto the same map — not a stylised diagram.
// Click (or tap) a location to see engagement details; works identically
// on desktop and touch.

const HQ = { x: 68.65, y: 26.78 }; // Johannesburg/Sandton, the anchor point — same projection as every other marker

export default function RegionalFootprintMap() {
  const [activeId, setActiveId] = useState<string>(locations[0].id);
  const active: Location = locations.find((l) => l.id === activeId) ?? locations[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden border border-border-dark bg-bg-secondary sm:aspect-[16/10]">
        <svg viewBox={SOUTH_AFRICA_VIEWBOX} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
              x1={(HQ.x / 100) * 1000}
              y1={(HQ.y / 100) * 1000}
              x2={(loc.x / 100) * 1000}
              y2={(loc.y / 100) * 1000}
              stroke={loc.id === activeId ? "var(--accent-red-bright)" : "var(--accent-navy-bright)"}
              strokeWidth={loc.id === activeId ? 2.2 : 1.1}
              opacity={loc.id === activeId ? 0.9 : 0.35}
            />
          ))}
        </svg>

        {/* HQ marker */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${HQ.x}%`, top: `${HQ.y}%` }}>
          <span className="block h-2.5 w-2.5 rounded-full bg-accent-gold ring-4 ring-accent-gold/20" />
        </div>

        {/* Location markers */}
        {locations.map((loc) => {
          const isActive = loc.id === activeId;
          return (
            <button
              key={loc.id}
              onClick={() => setActiveId(loc.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              aria-pressed={isActive}
              aria-label={`${loc.name} — ${loc.engagements.length} engagement${loc.engagements.length > 1 ? "s" : ""}`}
            >
              <span
                className={`block rounded-full transition-all ${
                  isActive
                    ? "h-3.5 w-3.5 bg-accent-red-bright ring-4 ring-accent-red/25"
                    : "h-2 w-2 bg-accent-navy-bright ring-2 ring-accent-navy/20 group-hover:h-2.5 group-hover:w-2.5"
                }`}
              />
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide transition-opacity ${
                  isActive ? "text-ink-primary opacity-100" : "text-ink-faint opacity-0 group-hover:opacity-100"
                }`}
              >
                {loc.name}
              </span>
            </button>
          );
        })}
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
