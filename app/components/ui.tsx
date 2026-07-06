import Link from "next/link";
import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent-navy-bright">
      {children}
    </p>
  );
}

// Massive display headline - one per page, hero-level only
export function DisplayHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`font-display text-6xl font-black leading-[0.95] tracking-tight text-ink-primary sm:text-7xl lg:text-8xl ${className}`}>
      {children}
    </h1>
  );
}

// Section-level heading - clearly smaller than DisplayHeading, clearly larger than CardHeading
export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-3xl font-black leading-[1.0] tracking-tight text-ink-primary sm:text-4xl ${className}`}>
      {children}
    </h2>
  );
}

// Card/component-level heading - small, used inside cards and list items
export function CardHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`font-display text-base font-bold text-ink-primary ${className}`}>
      {children}
    </h3>
  );
}

export function Section({
  children,
  className = "",
  light = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`${light ? "bg-bg-secondary" : "bg-bg-primary/95"} ${className}`}>
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">{children}</div>
    </section>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-sm bg-accent-red px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-primary/40 px-6 py-3.5 font-body text-sm font-semibold text-ink-primary transition-colors hover:border-ink-primary hover:bg-ink-primary/10"
    >
      {children}
    </Link>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-border-dark" />;
}
