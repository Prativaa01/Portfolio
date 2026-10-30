"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";

/** Official Discord SVG Icon */
export function DiscordIcon({ className = "w-5 h-5", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/** Arrow-up-right icon */
function ArrowExternal() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactCard({
  variant = "panel",
  className = "",
}: {
  /**
   * "panel" sits near nav inside WorksMenu; "finale" is embedded in case study finale
   */
  variant?: "panel" | "finale";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(CONTACT.discord.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[#565448]/80 bg-[#161712]/95 p-6 text-cream shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cream/40 ${
        variant === "finale" ? "max-w-[420px] w-full" : "w-[360px]"
      } ${className}`}
      style={{
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Subtle background ambient glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#5865F2]/10 blur-2xl transition-all duration-500 group-hover:bg-[#5865F2]/20"
        aria-hidden="true"
      />

      {/* Header status row */}
      <div className="flex items-center justify-between pb-3 border-b border-[#565448]/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-ruda text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/75">
            Available For Work
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-ruda text-[11px] font-medium text-cream/60">
          <DiscordIcon size={14} className="text-[#5865F2]" />
          <span>Discord</span>
        </span>
      </div>

      {/* Main card body */}
      <div className="pt-4 pb-5 flex flex-col gap-1.5">
        <h3 className="font-display text-[26px] leading-[1.15] text-cream tracking-[0.02em]">
          Let’s Connect
        </h3>
        <p className="font-ruda text-[13px] leading-[19px] text-[#b8b3a8]">
          Have a project in mind, design opportunity, or just want to chat? Reach out directly to me on Discord.
        </p>

        {/* Discord handle display with Copy button */}
        <div className="mt-2.5 flex items-center justify-between rounded-md border border-[#565448]/60 bg-black/40 px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <DiscordIcon size={16} className="text-[#5865F2] shrink-0" />
            <span className="truncate font-ruda text-[13px] text-cream font-medium">
              {CONTACT.discord.username}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 cursor-pointer rounded px-2 py-1 font-ruda text-[11px] font-semibold tracking-wider text-cream/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Copy Discord username"
          >
            {copied ? (
              <span className="text-emerald-400 font-bold">COPIED!</span>
            ) : (
              <span>COPY</span>
            )}
          </button>
        </div>
      </div>

      {/* Direct Discord CTA Button */}
      <a
        href={CONTACT.discord.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-4 py-3 font-ruda text-[13px] font-bold tracking-wider text-white shadow-lg shadow-[#5865F2]/25 transition-all duration-200 hover:bg-[#4752C4] hover:shadow-xl hover:shadow-[#5865F2]/40 active:translate-y-[1px]"
      >
        <DiscordIcon size={18} />
        <span>Chat on Discord</span>
        <ArrowExternal />
      </a>
    </div>
  );
}
