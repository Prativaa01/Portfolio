/**
 * Home page geometry, measured from the 2x Figma export of the "my portfolio"
 * frame. Every value here is in design px (image px / 2).
 *
 * `*Ink` values are the top of the glyph ink, not the CSS box top — feed them
 * through displayTop/sansTop from lib/typography to get a `top`.
 */

export const HOME = {
  frameWidth: 9916,
  frameHeight: 770,

  /**
   * `scaleX` values correct for a proportion mismatch: Cormorant Garamond as
   * rendered is ~0.66 cap-height per em, while the Figma reference measures
   * ~0.72 — so at equal cap height our letterforms come out ~12% wider. Each
   * scaleX was fitted from the reference's measured cap height and ink width.
   * If the Figma file turns out to use a more condensed serif, drop these.
   */
  hero: {
    left: 91.5,
    fontSize: 224,
    lineHeight: 205,
    inkTop: 101.5,
    scaleX: 0.86,
    // With line-height < font-size the browser's first-baseline placement
    // drifts from the centred model in typography.ts; this lands it back.
    topAdjust: -3.5,
  },

  person: {
    headingLeft: 39.8,
    headingFontSize: 52,
    headingScaleX: 0.9,
    headingInkTop: 80,
    linkLeft: 478,
    linkFontSize: 32,
    linkInkTop: 633.5,
    arrowLeft: 593,
    arrowWidth: 21.5,
    photo: { left: 777, top: 310, width: 356.5, height: 411.5 },
  },

  work: { left: 308, fontSize: 212, inkTop: 344.5, scaleX: 0.87, topAdjust: -2.5 },

  cases: {
    headingLeft: 91.3,
    headingFontSize: 52,
    headingScaleX: 0.9,
    headingInkTop: 108,
    listLeft: 783,
    itemFontSize: 48,
    itemInkTops: [173, 267, 361, 455],
    ruleLeft: 783,
    ruleWidth: 656.5,
    ruleThickness: 1,
    ruleTops: [233.5, 327.5, 421.5],
    placeholder: { left: 91, top: 528, width: 360.5, height: 200.5 },
    noteLeft: 783,
    noteFontSize: 16,
    noteLineHeight: 16,
    noteInkTops: [693.5, 709.5],
    viewLeft: 1296,
    viewFontSize: 24,
    viewInkTop: 696,
    viewArrowLeft: 1462,
    viewArrowWidth: 17.5,
  },

  expertise: {
    labelLeft: 42,
    labelFontSize: 52,
    labelScaleX: 0.9,
    labelInkTop: 67,
    cardWidth: 439,
    cardTops: [0, -9, -13, -16],
    borderLefts: [637, 1076, 1515, 1954, 2393.5],
    borderThickness: 1,
    numberFontSize: 70,
    numberScaleX: 0.87,
    numberOffset: 54,
    numberInkTops: [43, 34, 30, 27],
    titleFontSize: 36,
    titleScaleX: 0.88,
    titleInkTops: [383, 374, 370, 367],
    bodyFontSize: 24,
    bodyLineHeight: 24,
    bodyInkTops: [586, 579, 575, 572],
  },

  socials: {
    fontSize: 22,
    inkTop: 55.5,
    ruleTops: [73.5, 73.5, 73.5, 73.5],
    ruleThickness: 1,
    linksLefts: [740, 878, 984, 1099],
    taglineLeft: 806.5,
    taglineFontSize: 22,
    taglineInkTop: 728.5,
    taglineLetterSpacing: 1.0,
  },
} as const;

export const PANEL_WIDTHS = [1566, 1566, 1566, 1566, 2394, 1258] as const;

export const CASE_STUDIES = [
  "CAREMATE",
  "VETYO",
  "PRO REPAIR GURU",
  "BROWNWOOD",
] as const;

export const SOCIALS = ["INSTAGRAM", "LINKEDIN", "BEHANCE", "TIKTOK"] as const;

export const SOCIAL_HREFS = [
  "https://instagram.com",
  "https://linkedin.com",
  "https://behance.net",
  "https://tiktok.com",
] as const;

export const EXPERTISE = [
  {
    num: "01",
    title: "PRODUCT DESIGN",
    desc: "Apps and platforms shaped around clear flows, solid structure, and real user needs.",
    img: "/expertise/01-product-design.png",
  },
  {
    num: "02",
    title: "DIGITAL EXPERIENCES",
    desc: "Websites with considered layout, pacing, and interaction.",
    img: "/expertise/02-digital-experiences.png",
  },
  {
    num: "03",
    title: "MOTION DESIGN",
    desc: "Interface animation and prototypes that show how a product moves and feels.",
    img: "/expertise/03-motion-design.png",
  },
  {
    num: "04",
    title: "DESIGN SYSTEM",
    desc: "Component libraries and design tokens built for consistency, speed, and clean handoff.",
    img: "/expertise/04-design-system.png",
  },
] as const;

/**
 * Tiles sliced out of the project moodboard (Reference photos/pictures.png),
 * which drives the infinite marquee behind the "THE WORK" heading.
 */
export const PROJECTS = [
  { name: "BEMING", img: "/images/projects/01-beming.png" },
  { name: "CAREMATE APP", img: "/images/projects/02-caremate-app.png" },
  { name: "CAREMATE", img: "/images/projects/03-caremate.png" },
  { name: "LIA CLAY", img: "/images/projects/04-lia-clay.png" },
  { name: "MILK SHAKE", img: "/images/projects/05-milk-shake.png" },
  { name: "BROWNWOOD", img: "/images/projects/06-brownwood.png" },
  { name: "LEAF", img: "/images/projects/07-leaf.png" },
  { name: "CAMULLCH", img: "/images/projects/08-camullch.png" },
  { name: "WORLDLINK", img: "/images/projects/09-worldlink.png" },
] as const;

export const MARQUEE = {
  tileWidth: 248,
  /** Tile height follows the 462x422 source ratio. */
  tileHeight: 226,
  tileGap: 18,
  durationSeconds: 42,
  /** Two rows drifting against each other, both behind the heading. */
  rows: [
    { top: 300, reverse: false },
    { top: 356, reverse: true },
  ],
} as const;