import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Social / messenger share card: black panel with the portrait on the right
 * and "PRODUCT DESIGNER" stacked at the top of the black area — the site's own
 * display-serif treatment (the hero stacks "PRATIVA / DAHAL" the same way).
 * The photo is a pre-sized copy of /photos/profile.png kept next to this route
 * so it is bundled with the deployment (see app/og-photo.jpg).
 */

export const runtime = "nodejs";
export const alt = "Prativa Dahal — Product Designer in Kathmandu, Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "app", "og-photo.jpg"));

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "80px 64px",
            background: "#11120d",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#d8d0bd",
              fontFamily: "Georgia, serif",
              fontSize: 88,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <div>PRODUCT</div>
            <div>DESIGNER</div>
          </div>
        </div>
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={560}
          height={630}
          style={{ objectFit: "cover" }}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
