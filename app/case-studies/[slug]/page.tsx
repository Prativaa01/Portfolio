import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  caseStudyUrl,
  getCaseStudy,
  getNeighbors,
} from "@/lib/caseStudies";
import { PERSON_ID, SITE_NAME, SITE_URL } from "@/lib/seo";
import { StudyStatic } from "@/components/StudyStatic";

type Props = PageProps<"/case-studies/[slug]">;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const url = caseStudyUrl(study.slug);
  return {
    title: study.title,
    description: study.description,
    keywords: [
      study.displayName,
      `${study.displayName} case study`,
      "Prativa Dahal",
      "Product Designer",
      "UI/UX Design Portfolio",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: `${study.title} | Prativa Dahal`,
      description: study.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | Prativa Dahal`,
      description: study.description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const url = caseStudyUrl(study.slug);
  const { prev, next } = getNeighbors(study.slug);

  /** CreativeWork for this study + breadcrumb trail, both truthful:
      creator/author reference the single canonical Person @id. */
  const CASE_STUDY_JSON_LD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#creativework`,
        name: study.displayName,
        headline: study.title,
        description: study.overview,
        url,
        image: `${SITE_URL}${study.cover}`,
        creator: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: study.displayName,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <main>
      {/* Unique H1 for the static page — visually hidden because the study
          panel itself carries the designed display typography. */}
      <h1 className="sr-only">{study.h1}</h1>

      {/* The original designed study panel, rendered in flow. */}
      <StudyStatic slug={study.slug} />

      {/* Crawlable overview + internal links, styled after the site's
          visible FAQ sections so it reads as part of the same design. */}
      <section
        aria-labelledby="study-overview"
        className="w-full bg-sand px-6 py-16 text-ink md:px-16 md:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="study-overview" className="font-ruda text-2xl font-extrabold tracking-tight md:text-3xl">
            {study.displayName} — case study overview
          </h2>
          <p className="mt-4 font-ruda text-base leading-relaxed text-ink/80">
            {study.overview}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 font-ruda text-sm text-ink/80 sm:grid-cols-3">
            <div>
              <dt className="font-bold text-ink">Type</dt>
              <dd className="mt-1">{study.kind}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Year</dt>
              <dd className="mt-1">{study.year}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Role</dt>
              <dd className="mt-1">Product Designer</dd>
            </div>
          </dl>
          <p className="mt-8 font-ruda text-base leading-relaxed text-ink/80">
            Designed by{" "}
            <Link href="/about-me" className="font-bold text-ink underline underline-offset-4">
              Prativa Dahal
            </Link>
            , a product designer based in Kathmandu, Nepal, working with
            startups, product teams and founders worldwide. Explore the
            interactive version of this case study, the other featured case
            studies, or get in touch through the contact options on the{" "}
            <Link href="/" className="font-bold text-ink underline underline-offset-4">
              homepage
            </Link>
            .
          </p>
          <nav aria-label="Case studies" className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-ruda text-base font-bold">
            <Link
              href="/about-me?view=work"
              className="text-ink underline underline-offset-4 hover:opacity-75"
            >
              All work
            </Link>
            <Link
              href={`/case-studies/${prev.slug}`}
              className="text-ink underline underline-offset-4 hover:opacity-75"
            >
              Previous — {prev.displayName}
            </Link>
            <Link
              href={`/case-studies/${next.slug}`}
              className="text-ink underline underline-offset-4 hover:opacity-75"
            >
              Next — {next.displayName}
            </Link>
          </nav>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_STUDY_JSON_LD) }}
      />
    </main>
  );
}
