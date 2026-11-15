/**
 * Contact form → email relay.
 *
 * The browser posts the inquiry here; this server-side handler is the only
 * place that knows the secret (`.env.local` in dev, Vercel environment
 * variables in production). It stays off the client on purpose: anyone
 * holding the Resend key could send mail as the verified sender.
 *
 * Every entry is delivered by Resend to the site owner's inbox, with the
 * visitor's address on Reply-To — answering is a plain reply.
 *
 * On any failure the route reports it so the modal falls back to its mailto
 * handoff.
 */

import { CONTACT } from "@/lib/contact";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Malformed request body." },
      { status: 400 },
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const asText = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

  const name = asText(data.name) || "Portfolio Visitor";
  const email = asText(data.email); // Required — every delivery is by mail.
  const message = asText(data.message);

  if (!message) {
    return Response.json(
      { success: false, message: "A message is required." },
      { status: 400 },
    );
  }

  if (!email) {
    return Response.json(
      { success: false, message: "An email address is required." },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return Response.json(
      { success: false, message: "That email address doesn't look valid." },
      { status: 400 },
    );
  }

  return await sendViaResend(name, email, message);
}

/**
 * Mail lane: the inquiry goes to Resend and lands in the site owner's inbox
 * (CONTACT.email). The free "test sender" (onboarding@resend.dev) may only
 * deliver to the account owner's own address — which is exactly the
 * destination here. Replying to the thread addresses the visitor.
 */
async function sendViaResend(
  name: string,
  email: string,
  message: string,
): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { success: false, message: "Email delivery is not configured yet." },
      { status: 503 },
    );
  }

  const text = [
    `Name: ${name}`,
    `Reply email: ${email}`,
    "",
    message,
    "",
    "— Sent from the portfolio contact form (www.pratibhadahal.com.np)",
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio contact form <onboarding@resend.dev>",
        to: [CONTACT.email],
        reply_to: email,
        subject: `New portfolio inquiry from ${name.slice(0, 100)}`,
        text,
      }),
    });

    if (!response.ok) {
      return Response.json(
        { success: false, message: `Email delivery failed (${response.status}).` },
        { status: 502 },
      );
    }
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the email service." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
