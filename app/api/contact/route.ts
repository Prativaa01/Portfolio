/**
 * Contact form → Discord / email relay.
 *
 * The browser posts the inquiry here; this server-side handler is the only
 * place that knows the secrets (`.env.local` in dev, Vercel environment
 * variables in production). They stay off the client on purpose: anyone
 * holding the webhook URL could post into the target channel, and anyone
 * holding the Resend key could send mail as the verified sender.
 *
 * Two delivery lanes, chosen by whether the visitor left a reply address:
 *  - "discord" entries (no email): one embed into the #general webhook,
 *    mention-pings suppressed so a form post can never ping the channel.
 *  - "mail" entries (email): sent by Resend to the site owner's inbox, with
 *    the visitor's address on Reply-To — answering is a plain reply.
 *
 * On any failure the route reports it so the modal falls back to its mailto
 * handoff.
 */

import { CONTACT } from "@/lib/contact";

const EMBED_COLOR = 0xd8d0bd; // Site cream, to match the portfolio palette.
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
  const email = asText(data.email); // Optional — "discord" entries send none.
  const message = asText(data.message);

  if (!message) {
    return Response.json(
      { success: false, message: "A message is required." },
      { status: 400 },
    );
  }

  if (email && !email.includes("@")) {
    return Response.json(
      { success: false, message: "That email address doesn't look valid." },
      { status: 400 },
    );
  }

  if (email) {
    return await sendViaResend(name, email, message);
  }
  return await relayToDiscord(name, message);
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

/**
 * Discord lane: note-only entries embed into #general. Visitors control the
 * message body, so every mention (@everyone, @here, roles, users) is
 * suppressed — a form post can never ping the whole channel.
 */
async function relayToDiscord(
  name: string,
  message: string,
): Promise<Response> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json(
      { success: false, message: "Delivery inbox is not configured yet." },
      { status: 503 },
    );
  }

  const payload = {
    username: "Portfolio Inquiries",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: "New portfolio inquiry",
        color: EMBED_COLOR,
        description: message.slice(0, 4000),
        fields: [{ name: "Name", value: name.slice(0, 256), inline: true }],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return Response.json(
        { success: false, message: `Discord delivery failed (${response.status}).` },
        { status: 502 },
      );
    }
  } catch {
    return Response.json(
      { success: false, message: "Could not reach Discord." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
