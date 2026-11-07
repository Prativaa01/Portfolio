# SEO setup — www.pratibhadahal.com.np

Your site is SEO-ready after you deploy the current changes (Vercel
auto-builds on push). This file is the remaining manual checklist.

## 1. Verify live (after each push)

```bash
curl -s https://www.pratibhadahal.com.np/sitemap.xml
curl -s https://www.pratibhadahal.com.np/robots.txt
curl -s https://www.pratibhadahal.com.np/llms.txt
curl -s https://www.pratibhadahal.com.np/ | grep -i "<title>"
```

- `/sitemap.xml` → 2 URLs (`https://www.pratibhadahal.com.np/` and `/about-me`)
- `<title>` → `Prativa Dahal — Product Designer in Kathmandu, Nepal | UI/UX & Digital Products`
- `/llms.txt` → AI summary loads (optional, not a ranking factor)

## 2. Google Search Console (5 min)

1. https://search.google.com/search-console → Add property →
   enter `https://www.pratibhadahal.com.np` → verify (DNS TXT is easiest).
2. **Sitemaps** → submit `sitemap.xml`.
3. **URL Inspection** → paste `https://www.pratibhadahal.com.np/` →
   Request Indexing. Repeat for `/about-me`.
4. After 1–2 days, check **Pages** → "Indexed" for both URLs, and
   **Enhancements** → no structured-data errors.

## 3. Bing Webmaster Tools

1. https://www.bing.com/webmasters → Add site → import from Google
   Search Console (one click) → submit `sitemap.xml`.
2. Enable **AI Performance** to see how ChatGPT/Perplexity cite you.

## 4. Validate structured data (1 min)

Paste your homepage into https://search.google.com/test/rich-results —
expect: Person, WebSite, FAQPage, ProfilePage detected, no errors.
Note: no `aggregateRating` is emitted on purpose — never add fake
ratings/reviews; Google treats those as a policy violation.

## 5. What targets "Product Designer in Kathmandu, Nepal"

- Home `<title>` leads with "Prativa Dahal — Product Designer in
  Kathmandu, Nepal" so exact-name searches and local + remote hiring
  both resolve; the tail adds UI/UX and digital-product keywords (may
  truncate in SERP snippets by design — the important words sit first).
- The meta description states Kathmandu + remote/on-site/international
  availability in ≤ 160 chars.
- `/about-me` keeps its own unique title/description (no duplicates).
- One canonical per page, `lang="en"`, single Person `@id` shared
  everywhere (LinkedIn/Behance/Instagram via `sameAs` in `lib/seo.ts`).

### When you tweak copy — keep these true

- Titles ≤ 60 chars (the home title is a deliberate brand-first
  exception at 79 chars); descriptions 140–160 chars.
- FAQ schema must match the visible FAQ (they share `FAQS` in
  `lib/seo.ts` — edit once, both update).
- Change `SITE_URL` only in `lib/seo.ts` (canonical, sitemap, JSON-LD
  and share images all derive from it).
