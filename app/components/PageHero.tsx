import { ReactNode } from "react";
import { Eyebrow, DisplayHeading } from "./ui";

const GRADIENTS = {
  navy: "bg-gradient-navy-glow",
  red: "bg-gradient-red-glow",
  gold: "bg-gradient-gold-glow",
} as const;

const SCRIMS = {
  navy: "photo-scrim-navy",
  red: "photo-scrim-red",
  gold: "photo-scrim-gold",
} as const;

export function PageHero({
  eyebrow,
  title,
  description,
  gradient = "navy",
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  gradient?: keyof typeof GRADIENTS;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`relative flex min-h-[55vh] items-end overflow-hidden ${image ? "" : GRADIENTS[gradient]}`}>
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className={`absolute inset-0 ${SCRIMS[gradient]}`} />
        </>
      )}
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-36 lg:px-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <DisplayHeading className="mt-6 max-w-3xl !text-4xl sm:!text-5xl lg:!text-6xl">
          {title}
        </DisplayHeading>
        {description && (
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-muted">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
