"use client";

export function LogoCarousel({ items, light = false }: { items: string[]; light?: boolean }) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r ${
          light ? "from-bg-light" : "from-bg-primary"
        } to-transparent`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l ${
          light ? "from-bg-light" : "from-bg-primary"
        } to-transparent`}
      />
      <div className="flex w-max animate-marquee gap-3">
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className={`flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm border px-8 py-5 font-display text-base font-semibold ${
              light
                ? "border-border-light bg-white text-ink-on-light"
                : "border-border-dark bg-bg-secondary text-ink-primary"
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
