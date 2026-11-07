"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CONTACT } from "@/lib/contact";

/** Which entry point opened the popup: "discord" drops the reply email field. */
type ContactChannel = "discord" | "mail";

type ContactModalContextValue = {
  isOpen: boolean;
  openContactModal: (channel?: ContactChannel) => void;
  closeContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue>({
  isOpen: false,
  openContactModal: () => {},
  closeContactModal: () => {},
});

export function useContactModal() {
  return useContext(ContactModalContext);
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [channel, setChannel] = useState<ContactChannel>("mail");

  const openContactModal = useCallback((next: ContactChannel = "mail") => {
    setChannel(next);
    setIsOpen(true);
  }, []);
  const closeContactModal = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider
      value={{ isOpen, openContactModal, closeContactModal }}
    >
      {children}
      <ContactModal open={isOpen} onClose={closeContactModal} channel={channel} />
    </ContactModalContext.Provider>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ContactModal({
  open,
  onClose,
  channel,
}: {
  open: boolean;
  onClose: () => void;
  channel: ContactChannel;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "mailto" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStatus("idle");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) return;

    setStatus("submitting");
    setErrorMessage("");

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    // "mail" entries ask for a reply address; "discord" entries keep just a
    // name + note, so the `/api/contact` embed omits the Email field.
    const payload: { name: string; message: string; email?: string } = {
      name: fullName || "Portfolio Visitor",
      message: message.trim(),
    };
    if (channel === "mail") {
      payload.email = email.trim();
    }

    try {
      // Dispatched by the server-side handler in app/api/contact — Discord
      // for note-only entries, Resend email for reply-address entries. The
      // secrets never reach the browser bundle.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
      } else {
        throw new Error(data.message || "Submission rejected by server");
      }
    } catch {
      // Graceful fallback to mailto if the relay is unreachable
      try {
        const subject = `Portfolio message from ${fullName || "a visitor"}`;
        const body = [
          `Name: ${fullName}`,
          ...(email.trim() ? [`Email: ${email.trim()}`] : []),
          "",
          message.trim(),
        ].join("\n");

        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
        setStatus("mailto");
      } catch {
        setStatus("error");
        setErrorMessage("Could not deliver automatically. You can reach out directly via " + CONTACT.email);
      }
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Blurred luxury backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#d8d0bd]/20 bg-[#11120D] p-7 sm:p-9 md:p-11 text-[#d8d0bd] shadow-2xl transition-all"
        style={{
          boxShadow:
            "0 30px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Header row: REACH US heading + close button */}
        <div className="flex items-center justify-between pb-6 sm:pb-8">
          {/* Display serif at the body's inherited light weight — same heading
              treatment as the rest of the site instead of heavy bold Ruda. */}
          <h2
            id="contact-modal-title"
            className="font-display text-[26px] uppercase tracking-[0.08em] text-[#fffaf4] sm:text-[30px] md:text-[34px]"
          >
            REACH US
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#d8d0bd]/70 transition-colors hover:bg-white/10 hover:text-[#fffaf4]"
          >
            <CloseIcon />
          </button>
        </div>

        {status === "success" || status === "mailto" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-400">
              <CheckIcon />
            </div>
            {status === "success" ? (
              <>
                <h3 className="font-display text-[32px] tracking-wide text-[#fffaf4]">
                  Message Dispatched
                </h3>
                <p className="mt-2 max-w-sm font-ruda text-[13px] leading-relaxed text-[#b8b3a8]">
                  {channel === "mail" ? (
                    <>
                      Thank you for reaching out. Your message has landed
                      directly in Prativa&apos;s inbox — she&apos;ll reply to
                      you at {email.trim()}.
                    </>
                  ) : (
                    <>
                      Thank you for getting in touch. Your message has been
                      delivered straight to Prativa&apos;s Discord.
                    </>
                  )}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-display text-[32px] tracking-wide text-[#fffaf4]">
                  Almost Done
                </h3>
                <p className="mt-2 max-w-sm font-ruda text-[13px] leading-relaxed text-[#b8b3a8]">
                  The delivery service couldn&apos;t be reached, so your email app has been opened with your details pre-filled. Just hit send to reach Prativa ({CONTACT.email}).
                </p>
              </>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 cursor-pointer rounded-full border border-[#d8d0bd] px-7 py-2 font-ruda text-[13px] font-medium tracking-wide text-[#d8d0bd] transition-colors hover:bg-[#d8d0bd] hover:text-[#11120D]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              {/* Left Column: First Name, Last Name, Email, Consent */}
              <div className="flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="contact-first-name" className="sr-only">
                      First Name
                    </label>
                    <input
                      id="contact-first-name"
                      type="text"
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border-b border-[#d8d0bd]/25 bg-transparent py-2.5 font-ruda text-[15px] text-[#fffaf4] placeholder-[#878787] transition-colors focus:border-[#d8d0bd] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-last-name" className="sr-only">
                      Last Name
                    </label>
                    <input
                      id="contact-last-name"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border-b border-[#d8d0bd]/25 bg-transparent py-2.5 font-ruda text-[15px] text-[#fffaf4] placeholder-[#878787] transition-colors focus:border-[#d8d0bd] focus:outline-none"
                    />
                  </div>

                  {/* Email is asked only on "mail" entries — the Discord
                      mode stays a name + note, with no reply field. */}
                  {channel === "mail" && (
                    <div>
                      <label htmlFor="contact-email" className="sr-only">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-[#d8d0bd]/25 bg-transparent py-2.5 font-ruda text-[15px] text-[#fffaf4] placeholder-[#878787] transition-colors focus:border-[#d8d0bd] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {channel === "mail" && (
                  <label className="group flex cursor-pointer items-start gap-3 pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[#d8d0bd]/40 bg-transparent text-[#d8d0bd] accent-[#d8d0bd] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="font-ruda text-[11px] leading-[16px] text-[#878787] transition-colors group-hover:text-[#d8d0bd]/80">
                      I give permission to contact me at this email address.
                    </span>
                  </label>
                )}
              </div>

              {/* Right Column: Message & Send Row */}
              <div className="flex flex-col justify-between gap-6">
                <div className="flex flex-1 flex-col">
                  <label htmlFor="contact-message" className="sr-only">
                    Type your message here
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full flex-1 min-h-[140px] resize-none border-b border-[#d8d0bd]/25 bg-transparent py-2.5 font-ruda text-[15px] leading-relaxed text-[#fffaf4] placeholder-[#878787] transition-colors focus:border-[#d8d0bd] focus:outline-none"
                  />
                </div>

                {errorMessage && (
                  <p className="font-ruda text-[12px] text-rose-400">
                    {errorMessage}
                  </p>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="max-w-[190px] font-ruda text-[10px] leading-tight text-[#878787]">
                    {channel === "mail"
                      ? "Sends straight to Prativa's email inbox."
                      : "Delivers directly to Prativa's Discord."}
                  </p>

                  <button
                    type="submit"
                    disabled={status === "submitting" || !consent}
                    className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-[#d8d0bd] px-7 py-2.5 font-ruda text-[13px] font-medium tracking-wide text-[#d8d0bd] transition-all duration-200 hover:bg-[#d8d0bd] hover:text-[#11120D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>{status === "submitting" ? "Sending..." : "Send"}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
