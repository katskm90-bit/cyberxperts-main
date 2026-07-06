"use client";

import { useState } from "react";
import { siteContent } from "@/lib/site-content";

export default function WhatsAppButton() {
  const [dismissed, setDismissed] = useState(false);
  const { whatsappNumber, whatsappMessage } = siteContent.company;

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss WhatsApp button"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bg-secondary text-ink-muted shadow-md transition-colors hover:bg-bg-tertiary hover:text-ink-primary"
      >
        <span className="text-xs leading-none">✕</span>
      </button>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
          <path d="M16.04 4C9.4 4 4 9.32 4 15.87c0 2.1.56 4.16 1.62 5.97L4 28l6.36-1.63a12.2 12.2 0 0 0 5.68 1.4h.01c6.64 0 12.04-5.32 12.04-11.87C28.09 9.32 22.69 4 16.04 4zm0 21.7h-.01a10.2 10.2 0 0 1-5.13-1.4l-.37-.21-3.77.97 1-3.62-.24-.37a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.46-9.8 9.95-9.8 2.66 0 5.16 1.02 7.04 2.87a9.65 9.65 0 0 1 2.92 6.93c0 5.4-4.47 9.8-9.95 9.8zm5.45-7.34c-.3-.15-1.76-.85-2.03-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.94 1.14-.17.2-.35.22-.65.07-.3-.15-1.25-.45-2.38-1.45a8.9 8.9 0 0 1-1.64-2.02c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>
    </div>
  );
}
