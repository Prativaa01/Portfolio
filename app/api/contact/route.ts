/**
 * Contact form → Discord relay.
 *
 * The browser posts the inquiry here; this server-side handler is the only
 * place that knows DISCORD_WEBHOOK_URL (`.env.local` in dev, Netlify
 * environment variables in production). The URL stays off the client on
 * purpose: anyone holding a webhook URL could post into the target channel.
 *
 * Success answers 204 No Content from Discord. On any failure the route
 * reports it so the modal falls back to its mailto handoff.
 */

const EMBED_COLOR = 0xd8d0bd; // Site cream, to match the portfolio palette.

export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { success: false, message: "Delivery inbox is not configured yet." },
      { status: 503 },
    );
  }

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

  const payload = {
    username: "Portfolio Inquiries",
    // Visitors control the message body — suppress every mention (@everyone,
    // @here, roles, users) so a form post can never ping the whole channel.
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: "New portfolio inquiry",
        color: EMBED_COLOR,
        description: message.slice(0, 4000),
        fields: [
          { name: "Name", value: name.slice(0, 256), inline: true },
          // Discord-mode entries carry no reply address — omit the field
          // entirely rather than showing an empty row.
          ...(email
            ? [{ name: "Email", value: email.slice(0, 256), inline: true }]
            : []),
        ],
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
