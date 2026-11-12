import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { CASE_STUDIES, caseStudyUrl } from "@/lib/caseStudies";

/** Deterministic lastmod (ISO date) — stable across deploys so crawlers can
    trust the value. Bump deliberately when public content changes. */
const LAST_MODIFIED = "2026-11-12";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about-me`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...CASE_STUDIES.map((study) => ({
      url: caseStudyUrl(study.slug),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
