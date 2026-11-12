/**
 * Registry for the four statically-routed case-study pages
 * (`/case-studies/<slug>`).
 *
 * Every string here is lifted from content that already exists on the live
 * site (the case-study overlays and the works menu) — nothing is invented:
 * - `overview` is the OVERVIEW paragraph shown inside each study overlay.
 * - `kind` / `year` are the DETAILS rows inside each overlay.
 * - `cover` is an existing asset already used by the works menu or the
 *   landing case-studies panel.
 *
 * Titles use the site-wide `%s | Prativa Dahal` template from
 * `app/layout.tsx` and stay ≤ 60 rendered characters.
 * Descriptions stay ≤ 160 characters.
 */

import { SITE_URL } from "./seo";

export type CaseStudySlug = "caremate" | "proleap" | "arkiva" | "aeva";

export type CaseStudy = {
  slug: CaseStudySlug;
  /** Display name used in prose (matches the FAQ casing). */
  displayName: string;
  /** Row label as shown in the case-studies panel / works cards. */
  label: string;
  /** Unique `<title>` (template appends "| Prativa Dahal"). */
  title: string;
  /** Unique meta description, ≤ 160 chars. */
  description: string;
  /** Unique H1 for the static page. */
  h1: string;
  /** OVERVIEW paragraph, verbatim from the study overlay. */
  overview: string;
  /** DETAILS rows, verbatim from the study overlay. */
  kind: string;
  year: string;
  /** Existing cover asset (works-menu card or case-studies preview). */
  cover: string;
  coverAlt: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "caremate",
    displayName: "Caremate",
    label: "CAREMATE",
    title: "Caremate — Healthcare App Case Study",
    description:
      "Case study: Caremate, a digital health platform that helps people understand symptoms, book vetted doctors and reach emergency care. By Prativa Dahal.",
    h1: "Caremate — digital health platform case study by Prativa Dahal",
    overview:
      "A digital health platform engineered to bridge the critical gap between feeling unwell and receiving verified clinical care. Helping people understand symptoms, schedule vetted doctors, consult remotely, and access emergency help — even in constrained network environments.",
    kind: "Personal project",
    year: "2026",
    cover: "/images/works/caremate.png",
    coverAlt: "Caremate healthcare app interface — digital health platform case study preview",
  },
  {
    slug: "proleap",
    displayName: "ProLeap",
    label: "PROLEAP",
    title: "ProLeap — Career Platform Case Study",
    description:
      "Case study: ProLeap, a career platform combining learning, mentorship and workshops to guide people toward real career opportunities. By Prativa Dahal.",
    h1: "ProLeap — career platform case study by Prativa Dahal",
    overview:
      "ProLeap is a career-focused platform designed to help people discover their potential, build skills, and connect with real career opportunities. It brings together learning, mentorship, workshops, and career resources to create a more practical and guided path toward career growth.",
    kind: "Office project",
    year: "2026",
    cover: "/images/projects/proleap.png",
    coverAlt: "ProLeap career platform interface — career growth case study preview",
  },
  {
    slug: "arkiva",
    displayName: "Arkiva",
    label: "ARKIVA",
    title: "Arkiva — SaaS Platform Case Study",
    description:
      "Case study: Arkiva, a SaaS platform giving construction companies in Nepal a branded website and dashboard to manage services and inquiries. By Prativa Dahal.",
    h1: "Arkiva — SaaS platform for construction companies, case study by Prativa Dahal",
    overview:
      "Arkiva is a SaaS platform for small and mid-size construction companies in Nepal. Each company gets a branded public website and a dashboard to manage services, materials, and client inquiries, all on one monthly subscription.",
    kind: "SaaS product",
    year: "2026",
    cover: "/images/works/arkiva.png",
    coverAlt: "Arkiva SaaS platform for construction companies — case study preview",
  },
  {
    slug: "aeva",
    displayName: "Aeva",
    label: "AEVA",
    title: "Aeva — Lip Gloss Brand Case Study",
    description:
      "Case study: Aeva, a lip gloss brand celebrating self-expression through color, shine and confidence. Brand and product design by Prativa Dahal.",
    h1: "Aeva — lip gloss brand case study by Prativa Dahal",
    overview:
      "AEVA is a lip gloss brand designed to celebrate self-expression through color, shine, and confidence. With glossy finishes and versatile shades, AEVA brings a fresh, playful approach to beauty, making every lip look a little more you.",
    kind: "Personal project",
    year: "2026",
    cover: "/images/projects/aeva-cover.png",
    coverAlt: "Aeva lip gloss brand visual — e-commerce case study preview",
  },
];

/** Display order mirrors the landing case-studies list. */
export const CASE_STUDY_ORDER: CaseStudySlug[] = [
  "caremate",
  "proleap",
  "arkiva",
  "aeva",
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}

/** Circular previous/next within `CASE_STUDY_ORDER`. */
export function getNeighbors(slug: CaseStudySlug): {
  prev: CaseStudy;
  next: CaseStudy;
} {
  const i = CASE_STUDY_ORDER.indexOf(slug);
  return {
    prev: getCaseStudy(CASE_STUDY_ORDER[(i - 1 + CASE_STUDY_ORDER.length) % CASE_STUDY_ORDER.length])!,
    next: getCaseStudy(CASE_STUDY_ORDER[(i + 1) % CASE_STUDY_ORDER.length])!,
  };
}

export function caseStudyUrl(slug: CaseStudySlug): string {
  return `${SITE_URL}/case-studies/${slug}`;
}
