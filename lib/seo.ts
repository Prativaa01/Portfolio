/**
 * Single source of truth for SEO / AEO / GEO.
 *
 * Change the domain here once — canonicals, sitemap, JSON-LD and llms.txt
 * all derive from these constants. Do not special-case the domain elsewhere.
 *
 * Everything below is truthful to the live site:
 * - Only claims already visible on the site are repeated here.
 * - No fabricated ratings, review counts, years of experience, or client
 *   statistics (a structured-data policy violation).
 */

export const SITE_URL = "https://www.pratibhadahal.com.np"; // Canonical host — the apex 308-redirects here on Vercel.
export const SITE_NAME = "Prativa Dahal";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const PERSON_NAME = "Prativa Dahal";
export const JOB_TITLE = "Product Designer";

/**
 * Home `<title>` — brand-first format per positioning brief. Note: at 79
 * chars SERP snippets may truncate the tail ("| UI/UX & Digital Products");
 * the truncated cut still reads naturally because identity keywords lead.
 */
export const HOME_TITLE =
  "Prativa Dahal — Product Designer in Kathmandu, Nepal | UI/UX & Digital Products"; // 79 chars

/** Home meta description — ≤ 160 chars, answer-first. */
export const HOME_DESCRIPTION =
  "Prativa Dahal is a product designer in Kathmandu, Nepal. She designs thoughtful digital experiences for web and mobile — open to remote, on-site and international work.";

export const ABOUT_TITLE = "About the Product Designer in Kathmandu"; // + template = ≤ 60
export const ABOUT_DESCRIPTION =
  "Meet Prativa Dahal, a product designer from Kathmandu, Nepal. Her approach, featured case studies and process for apps, websites and design systems.";

export const OG_IMAGE = "/opengraph-image";
export const PORTRAIT_IMAGE = `${SITE_URL}/photos/profile.png`;

export const SAME_AS = [
  "https://www.instagram.com/prativa_designs/reels/?hl=en",
  "https://www.linkedin.com/in/prativadahal01",
  "https://www.behance.net/prativadahal01",
];

export const KNOWS_ABOUT = [
  "Product Design",
  "UI/UX Design",
  "User Experience Design",
  "Digital Product Design",
  "Web Design",
  "Mobile App Design",
  "Design Systems",
  "Prototyping",
  "Interaction Design",
  "Motion Design",
  "AI-assisted Design and Prototyping",
] as const;

/** Visible on the page AND emitted as FAQPage JSON-LD — the two must match. */
export const FAQS = [
  {
    q: "What does Prativa Dahal do?",
    a: "Prativa Dahal is a product designer based in Kathmandu, Nepal. She designs digital products that solve real problems through clear systems and considered motion — including apps, platforms, websites and brand systems. Her featured case studies are Caremate, Proleap, Arkiva and Aeva.",
  },
  {
    q: "Is Prativa Dahal available for freelance or remote design work?",
    a: "Prativa works remotely with clients worldwide — startups, product teams and founders — from her base in Kathmandu, Nepal, and is open to on-site and hybrid opportunities in Nepal and internationally. For new projects, collaborations or enquiries, use the contact options on this site — email or Discord links are listed on the homepage and on the about page.",
  },
  {
    q: "Which case studies are featured in this portfolio?",
    a: "This portfolio features four in-depth case studies: Caremate, Proleap, Arkiva and Aeva. Each case study covers the problem, research, design process, solution screens, strengths and weaknesses analysis, and what was learned. Open them from the Case Studies panel on the homepage or the work menu on the about page.",
  },
  {
    q: "What services does Prativa Dahal offer?",
    a: "Prativa offers product design for apps and platforms, digital experience design for websites, motion design and prototypes, and design system work including component libraries and design tokens. Clear structure and careful motion carry through every screen she designs.",
  },
] as const;

export const HOME_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
} as const;

/** Person + WebSite graph rendered in the root layout `<head>`. */
export const SITE_GRAPH_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: PERSON_NAME,
      jobTitle: JOB_TITLE,
      url: `${SITE_URL}/about-me`,
      mainEntityOfPage: `${SITE_URL}/about-me`,
      image: PORTRAIT_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      knowsAbout: [...KNOWS_ABOUT],
      sameAs: [...SAME_AS],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Prativa Dahal — Product Designer",
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
  ],
} as const;

/** ProfilePage on /about-me, referencing the single canonical Person @id. */
export const ABOUT_PROFILE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/about-me`,
  mainEntity: { "@id": PERSON_ID },
  dateModified: new Date().toISOString(),
} as const;
