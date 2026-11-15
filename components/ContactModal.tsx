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

/**
 * "GET IN TOUCH" modal, rebuilt pixel-for-pixel from the reference frame
 * (`public/Reference photos/contact.png`). On desktop the modal reproduces
 * the WHOLE reference artboard — sand page, "PRATIVA DAHAL" / "contact"
 * header row, and the black-bordered card at its measured position — scaled
 * down and centered as a floating popup over a dimmed page. The artboard
 * (3688x2216) acts as the cqw container, so the composition is an exact
 * proportional scale of the reference at any size. The card itself is a
 * nested cqw container, so every card measurement keeps its original
 * card-relative value. Delivery is email-only via `/api/contact` (Resend),
 * with a `mailto:` handoff if the relay is unreachable.
 */

type ContactModalContextValue = {
  isOpen: boolean;
  openContactModal: () => void;
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

  const openContactModal = useCallback(() => setIsOpen(true), []);
  const closeContactModal = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider
      value={{ isOpen, openContactModal, closeContactModal }}
    >
      {children}
      <ContactModal open={isOpen} onClose={closeContactModal} />
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
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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

    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      name: name.trim() || "Portfolio Visitor",
      email: email.trim(),
      message: message.trim(),
    };

    try {
      // Delivered by the server-side handler in app/api/contact — the
      // visitor's address rides on Reply-To, so answering is a plain reply.
      // The Resend key never reaches the browser bundle.
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
        const subject = `Portfolio message from ${payload.name}`;
        const body = [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          "",
          payload.message,
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
    setName("");
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
      aria-label="Get in touch"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 md:p-0"
    >
      {/* Desktop backdrop: the page behind, dimmed like a popup overlay */}
      <div onClick={onClose} className="fixed inset-0 hidden bg-black/80 backdrop-blur-md md:block" />
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden"
      />

      {/* ── Desktop: the whole reference artboard, floating as a popup ──────
          The 3688x2216 frame is scaled to ~72% of the contain-fit size
          (capped at 1100px) and centered: sand page, the header row, then
          the card at its measured position (margins 284/284/244/246).
          Clicking the dimmed page or anything outside the card closes the
          modal. */}
      <div
        onClick={onClose}
        className="relative z-10 hidden bg-sand md:block"
        style={{
          width: "min(72vw, 119.827vh, 1100px)",
          aspectRatio: "3688 / 2216",
          containerType: "inline-size",
        }}
      >
        {/* Header row, ink-calibrated against the reference (Roboto
            Condensed 400). Offsets place the rendered ink, not the CSS box. */}
        <span
          className="absolute whitespace-nowrap font-condensed text-black"
          style={{ left: "7.7394cqw", top: "3.9548cqw", fontSize: "1.2148cqw", lineHeight: 1, letterSpacing: "-0.0226cqw" }}
        >
          PRATIVA DAHAL
        </span>
        <span
          className="absolute whitespace-nowrap font-condensed text-black"
          style={{ left: "87.9926cqw", top: "3.9011cqw", fontSize: "1.295cqw", lineHeight: 1, letterSpacing: "0.0632cqw" }}
        >
          contact
        </span>

        {/* The card at its measured artboard position. It is its own cqw
            container, so every internal value keeps its card-relative
            meaning from the pixel calibration. */}
        <div
          className="absolute"
          onClick={(e) => e.stopPropagation()}
          style={{ left: "7.7017cqw", top: "6.6161cqw", width: "84.5987cqw", containerType: "inline-size" }}
        >
          <div className="relative aspect-[3120/1726] overflow-hidden rounded-[1.06cqw] border-[0.705cqw] border-black bg-sand">
            <h2
              id="contact-modal-title"
              className="absolute left-[-2.741cqw] top-[3.28cqw] m-0 whitespace-nowrap font-display font-bold text-black"
              style={{ fontSize: "14.904cqw", lineHeight: 1, letterSpacing: "0em" }}
            >
              GET IN TOUCH
            </h2>

            {status === "success" || status === "mailto" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-[10cqw] text-center">
                <div className="mb-[2.2cqw] flex h-[5.5cqw] w-[5.5cqw] items-center justify-center rounded-full border-[0.2cqw] border-ink/40 bg-ink/5 text-ink">
                  <CheckIcon />
                </div>
                {status === "success" ? (
                  <>
                    <h3
                      className="m-0 font-display font-bold text-black"
                      style={{ fontSize: "4.6cqw", lineHeight: 1.15 }}
                    >
                      Message Dispatched
                    </h3>
                    <p
                      className="mx-auto mt-[1cqw] max-w-[52cqw] font-ruda text-[#565448]"
                      style={{ fontSize: "1.6cqw", lineHeight: 1.6 }}
                    >
                      Thank you for reaching out. Your message has landed directly
                      in Prativa&apos;s inbox — she&apos;ll reply to you at{" "}
                      {email.trim()}.
                    </p>
                  </>
                ) : (
                  <>
                    <h3
                      className="m-0 font-display font-bold text-black"
                      style={{ fontSize: "4.6cqw", lineHeight: 1.15 }}
                    >
                      Almost Done
                    </h3>
                    <p
                      className="mx-auto mt-[1cqw] max-w-[52cqw] font-ruda text-[#565448]"
                      style={{ fontSize: "1.6cqw", lineHeight: 1.6 }}
                    >
                      The delivery service couldn&apos;t be reached, so your email
                      app has been opened with your details pre-filled. Just hit
                      send to reach Prativa ({CONTACT.email}).
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-[2.6cqw] cursor-pointer rounded-full border-[0.14cqw] border-ink px-[3.4cqw] py-[1cqw] font-ruda text-[1.6cqw] font-medium text-ink transition-colors hover:bg-ink hover:text-sand"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="contact-name" className="sr-only">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="absolute left-[3.14cqw] top-[22.07cqw] w-[32.2cqw] rounded-none border-0 border-b-[0.385cqw] border-[#A49C9C] bg-transparent px-0 pb-[0.451cqw] pt-0 font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                  style={{ fontSize: "2.1cqw", lineHeight: 1 }}
                />

                <label htmlFor="contact-email" className="sr-only">
                  Mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="Mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="absolute left-[3.14cqw] top-[29.44cqw] w-[32.2cqw] rounded-none border-0 border-b-[0.385cqw] border-[#A49C9C] bg-transparent px-0 pb-[0.451cqw] pt-0 font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                  style={{ fontSize: "2.1cqw", lineHeight: 1 }}
                />

                <label htmlFor="contact-message" className="sr-only">
                  Type your message here
                </label>
                <textarea
                  id="contact-message"
                  required
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="absolute left-[49.3cqw] top-[22.03cqw] h-[18.295cqw] w-[41.1cqw] resize-none rounded-none border-0 border-b-[0.385cqw] border-[#A49C9C] bg-transparent px-0 pb-[0.5cqw] pl-0 pt-[0.232cqw] font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                  style={{ fontSize: "2.1cqw", lineHeight: 1.2 }}
                />

                {errorMessage && (
                  <p
                    className="absolute left-[49.3cqw] top-[41.4cqw] m-0 font-ruda text-rose-700"
                    style={{ fontSize: "1.5cqw" }}
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="absolute left-[73.97cqw] top-[45.86cqw] flex h-[5.06cqw] w-[16.54cqw] cursor-pointer items-center justify-center rounded-[0.58cqw] border-0 bg-ink font-display font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ fontSize: "2.55cqw", lineHeight: 1 }}
                >
                  {status === "submitting" ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: same styling, stacked for touch ──────────────────────── */}
      <div
        className="relative z-10 w-[min(560px,92vw)] md:hidden"
        style={{ containerType: "inline-size" }}
      >
        <div className="overflow-hidden rounded-[4cqw] border-[1.4cqw] border-black bg-sand px-[7cqw] pb-[8cqw] pt-[8cqw]">
          <div className="flex items-start justify-between">
            <h2
              id="contact-modal-title-mobile"
              className="m-0 font-display font-bold text-black"
              style={{ fontSize: "10.5cqw", lineHeight: 1 }}
            >
              GET IN TOUCH
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-me-[1cqw] -ms-[1cqw] flex size-[9cqw] cursor-pointer items-center justify-center text-black/60 transition-colors hover:text-black"
            >
              <CloseIcon />
            </button>
          </div>

          {status === "success" || status === "mailto" ? (
            <div className="flex flex-col items-center pt-[9cqw] text-center">
              <div className="mb-[4cqw] flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full border-[0.4cqw] border-ink/40 bg-ink/5 text-ink">
                <CheckIcon />
              </div>
              {status === "success" ? (
                <>
                  <h3
                    className="m-0 font-display font-bold text-black"
                    style={{ fontSize: "7cqw", lineHeight: 1.15 }}
                  >
                    Message Dispatched
                  </h3>
                  <p
                    className="mx-auto mt-[2.5cqw] max-w-[80cqw] font-ruda text-[#565448]"
                    style={{ fontSize: "3.6cqw", lineHeight: 1.6 }}
                  >
                    Thank you for reaching out. Your message has landed directly
                    in Prativa&apos;s inbox — she&apos;ll reply to you at{" "}
                    {email.trim()}.
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className="m-0 font-display font-bold text-black"
                    style={{ fontSize: "7cqw", lineHeight: 1.15 }}
                  >
                    Almost Done
                  </h3>
                  <p
                    className="mx-auto mt-[2.5cqw] max-w-[80cqw] font-ruda text-[#565448]"
                    style={{ fontSize: "3.6cqw", lineHeight: 1.6 }}
                  >
                    The delivery service couldn&apos;t be reached, so your email
                    app has been opened with your details pre-filled. Just hit
                    send to reach Prativa ({CONTACT.email}).
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="mt-[6cqw] cursor-pointer rounded-full border-[0.35cqw] border-ink px-[8cqw] py-[2.4cqw] font-ruda text-[3.6cqw] font-medium text-ink transition-colors hover:bg-ink hover:text-sand"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col pt-[9cqw]">
              <label htmlFor="contact-name-mobile" className="sr-only">
                Name
              </label>
              <input
                id="contact-name-mobile"
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-none border-0 border-b-[0.9cqw] border-[#A49C9C] bg-transparent px-0 pb-[2.4cqw] pt-0 font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                style={{ fontSize: "4.8cqw", lineHeight: 1 }}
              />

              <label htmlFor="contact-email-mobile" className="sr-only">
                Mail
              </label>
              <input
                id="contact-email-mobile"
                type="email"
                required
                placeholder="Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-[8.5cqw] block w-full rounded-none border-0 border-b-[0.9cqw] border-[#A49C9C] bg-transparent px-0 pb-[2.4cqw] pt-0 font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                style={{ fontSize: "4.8cqw", lineHeight: 1 }}
              />

              <label htmlFor="contact-message-mobile" className="sr-only">
                Type your message here
              </label>
              <textarea
                id="contact-message-mobile"
                required
                placeholder="Type your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-[8.5cqw] block h-[36cqw] w-full resize-none rounded-none border-0 border-b-[0.9cqw] border-[#A49C9C] bg-transparent px-0 pb-[3cqw] pt-0 font-display text-black outline-none placeholder:text-black placeholder:opacity-100"
                style={{ fontSize: "4.8cqw", lineHeight: 1.4 }}
              />

              {errorMessage && (
                <p className="m-0 mt-[3cqw] font-ruda text-[3.4cqw] text-rose-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-[7cqw] flex h-[13.5cqw] w-[46cqw] cursor-pointer items-center justify-center self-end rounded-[2.6cqw] border-0 bg-ink font-display font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontSize: "4.8cqw", lineHeight: 1 }}
              >
                {status === "submitting" ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
