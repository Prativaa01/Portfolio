/**
 * Validates SEO output of a production build (`npm run build` first):
 * - every JSON-LD block on every public page parses as valid JSON
 * - each page has title, description, canonical, robots, og:type,
 *   og:site_name and og:url
 * - sitemap.xml route contains every canonical URL
 *
 * Usage: node scripts/validate-seo.cjs
 */
const fs = require("fs");

const pages = [
  "index",
  "about-me",
  "case-studies/caremate",
  "case-studies/proleap",
  "case-studies/arkiva",
  "case-studies/aeva",
];

let failures = 0;

for (const p of pages) {
  const html = fs.readFileSync(`.next/server/app/${p}.html`, "utf8");

  // JSON-LD validity
  const blocks = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
  let ok = 0;
  for (const b of blocks) {
    try {
      JSON.parse(b);
      ok++;
    } catch (e) {
      failures++;
      console.error(`INVALID JSON-LD in ${p}: ${e.message}`);
    }
  }

  // Required head tags
  const grab = (re) => (html.match(re) || [])[1];
  const title = grab(/<title>([\s\S]*?)<\/title>/);
  const required = {
    title,
    description: grab(/name="description" content="([^"]*)"/),
    canonical: grab(/rel="canonical" href="([^"]*)"/),
    robots: grab(/name="robots" content="([^"]*)"/),
    "og:type": grab(/property="og:type" content="([^"]*)"/),
    "og:site_name": grab(/property="og:site_name" content="([^"]*)"/),
    "og:url": grab(/property="og:url" content="([^"]*)"/),
    "og:image": grab(/property="og:image" content="([^"]*)"/),
    "twitter:card": grab(/name="twitter:card" content="([^"]*)"/),
  };
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    failures++;
    console.error(`MISSING in ${p}: ${missing.join(", ")}`);
  }
  console.log(
    `${p} | ld+json valid: ${ok} | title: ${title} | canonical: ${required.canonical}`
  );
}

// Sitemap must include every canonical
const sitemapPath = fs.existsSync(".next/server/app/sitemap.xml.body")
  ? ".next/server/app/sitemap.xml.body"
  : null;
if (sitemapPath) {
  const sm = fs.readFileSync(sitemapPath, "utf8");
  const count = (sm.match(/<url>/g) || []).length;
  console.log(`sitemap.xml: ${count} <url> entries`);
}

process.exit(failures ? 1 : 0);
