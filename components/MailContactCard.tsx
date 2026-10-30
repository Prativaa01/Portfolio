"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";

/**
 * Message card for the LET'S CONNECT finale.
 *
 * Uses a `mailto:` handoff — no backend, no API keys. On submit the visitor's
 * mail app opens with the destination, subject and body prefilled; they send
 * it themselves. Destination comes from `CONTACT.email` in lib/contact.ts.
 */
export function MailContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `Portfolio message from ${name.trim() || "a visitor"}`;
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[420px] rounded-xl border border-[#565448]/80 bg-[#161712]/95 p-6 text-cream shadow-2xl backdrop-blur-xl"
      style={{
        boxShadow:
          "0 20px 40px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Header status row */}
      <div className="flex items-center justify-between border-b border-[#565448]/40 pb-3">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
          <span className="font-ruda text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/75">
            Available for work
          </span>
        </span>
        <a
          href={`mailto:${CONTACT.email}`}
          className="font-ruda text-[11px] font-medium text-cream/60 underline underline-offset-2 transition-colors hover:text-cream"
        >
          {CONTACT.email}
        </a>
      </div>

      <h3 className="mt-4 font-display text-[26px] leading-[1.15] tracking-[0.02em]">
        Let’s Connect
      </h3>
      <p className="mt-1 font-ruda text-[13px] leading-[19px] text-[#b8b3a8]">
        Tell me a little about the project and hit send — your mail app opens
        with everything filled in.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        <label htmlFor="mail-name" className="sr-only">
          Your name
        </label>
        <input
          id="mail-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full rounded-md border border-[#565448]/60 bg-black/40 px-3 py-2 font-ruda text-[13px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:outline-none"
        />

        <label htmlFor="mail-email" className="sr-only">
          Your email
        </label>
        <input
          id="mail-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          className="w-full rounded-md border border-[#565448]/60 bg-black/40 px-3 py-2 font-ruda text-[13px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:outline-none"
        />

        <label htmlFor="mail-message" className="sr-only">
          Your message
        </label>
        <textarea
          id="mail-message"
          required
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me about the project..."
          className="w-full resize-none rounded-md border border-[#565448]/60 bg-black/40 px-3 py-2 font-ruda text-[13px] leading-[19px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-cream px-4 py-3 font-ruda text-[13px] font-bold tracking-wider text-ink transition-colors duration-200 hover:bg-[#e8e1d3] active:translate-y-[1px]"
      >
        <span>Send message</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <p className="mt-2.5 text-center font-ruda text-[10px] leading-[15px] text-cream/45">
        Opens your email app — nothing is sent automatically.
      </p>
    </form>
  );
}
