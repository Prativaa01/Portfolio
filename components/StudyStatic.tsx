"use client";

import { useRouter } from "next/navigation";
import { CaremateStudy } from "./CaremateStudy";
import { ProleapStudy } from "./ProleapStudy";
import { ArkivaStudy } from "./ArkivaStudy";
import { AevaStudy } from "./AevaStudy";
import type { CaseStudySlug } from "@/lib/caseStudies";

/**
 * Renders one of the existing case-study overlays as the body of its
 * statically-routed page (`/case-studies/<slug>`) instead of as a modal.
 *
 * - `open` is always true so the overlay's content is server-rendered into
 *   the page HTML (crawlers see the real overview text and images).
 * - `onClose` maps the overlay's Back button / ESC to the ALL WORK panel on
 *   the about page — the same place the modal's Back button leads to.
 */
const STUDIES: Record<CaseStudySlug, typeof CaremateStudy> = {
  caremate: CaremateStudy,
  proleap: ProleapStudy,
  arkiva: ArkivaStudy,
  aeva: AevaStudy,
};

export function StudyStatic({ slug }: { slug: CaseStudySlug }) {
  const router = useRouter();
  const Study = STUDIES[slug];
  return (
    <Study
      open
      asPage
      onClose={() => router.push("/about-me?view=work")}
    />
  );
}
