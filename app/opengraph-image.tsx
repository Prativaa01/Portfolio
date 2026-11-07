import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#11120d",
          color: "#d8d0bd",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>
          Product Designer · Kathmandu, Nepal
        </div>
        <div style={{ fontSize: 110, lineHeight: 1, marginTop: 24 }}>PRATIVA DAHAL</div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 28, maxWidth: 900 }}>
          Digital products that solve real problems through clear systems and
          considered motion.
        </div>
        <div style={{ fontSize: 24, marginTop: 36, color: "#fffaf4" }}>
          www.pratibhadahal.com.np
        </div>
      </div>
    ),
    { ...size },
  );
}
