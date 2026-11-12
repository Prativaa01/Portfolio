import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/caseStudies";
import { SITE_URL } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study by Prativa Dahal — Product Designer, Kathmandu, Nepal";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const name = study?.displayName ?? "Prativa Dahal";
  const subtitle = study?.kind ?? "Product Designer · Kathmandu, Nepal";
  /** Satori requires each text container to hold a single child node. */
  const tagline = `${subtitle} — designed by Prativa Dahal, Product Designer in Kathmandu, Nepal.`;

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
          Case study · Prativa Dahal
        </div>
        <div style={{ fontSize: 110, lineHeight: 1, marginTop: 24, textTransform: "uppercase" }}>
          {name}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 28, maxWidth: 900 }}>
          {tagline}
        </div>
        <div style={{ fontSize: 24, marginTop: 36, color: "#fffaf4" }}>
          {`${SITE_URL}/case-studies/${slug}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
