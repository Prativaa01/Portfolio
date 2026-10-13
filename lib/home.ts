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
    /**
     * Each expertise PNG is a full-card hover mockup with "0n", the title and
     * the description baked in at one FIXED position (image y 36.8 / 374.5 /
     * 576.1 once mapped through the cover fit). The live copy, however, is
     * staggered per card by cardTops. These shifts (live - baked, averaged
     * across number/title/body) re-align the baked text with the resting text
     * so the words do not jump when the picture appears.
     */
    hoverTextShift: [9, -1.1, -4.8, -7.8],
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

/**
 * Marquee geometry, measured from `Reference photos/motion reference.mp4`:
 * a fixed, centred window (25% of the panel width) that clips two rows of
 * landscape tiles drifting in opposite directions, sitting behind the heading.
 * Values below are design px within the 1566x770 work panel.
 */
export const MARQUEE = {
  windowLeft: 588,
  windowTop: 295,
  windowWidth: 390,
  windowHeight: 180,
  tileWidth: 120,
  /** Source tiles are landscape, ~1.7:1. */
  tileHeight: 70,
  tileGap: 12,
  durationSeconds: 26,
  /**
   * Rows also drift vertically, out of phase with each other, so the cluster
   * reads as moving on both axes. Amplitude matches the ~12-19px vertical
   * swing measured across frames in the reference clip.
   */
  driftAmplitude: 14,
  driftSeconds: 9,
  rows: [
    { top: 0, reverse: false },
    { top: 100, reverse: true },
  ],
} as const;

/**
 * Cinematic expand for the work panel, adapted from khanhnguyen.design's
 * "More Work" reveal: a rect that scales up to cover the panel while the two
 * words of the heading fly apart in opposite directions.
 *
 * The marquee window is already dead-centre in the panel, so scaling it from
 * its own centre is all that is needed to fill the frame — no repositioning.
 * Values below are design px within the 1566x770 work panel.
 */
export const WORK_REVEAL = {
  /**
   * How far the panel must travel (design px, either side of centre) before
   * the reveal starts. Larger values make the expansion feel more deliberate.
   */
  travel: 1000,
  /**
   * How far "THE" and "WORK" travel apart, in design px.
   *
   * Measured from the rendered heading: "THE" spans 308 -> 663 and "WORK"
   * spans 709 -> 1261 inside the 1566 panel, so 282 lands each word flush
   * against its edge with a small margin instead of clipping it off-screen.
   */
  splitX: 282,
  /**
   * Ink wash that fades in over the imagery as the panel fills.
   *
   * The heading flips to cream, but cream over a light screenshot is still
   * weak. A light scrim over the whole panel both unifies the collage and
   * gives the cream type something to sit on.
   */
  scrimOpacity: 0.34,
  /**
   * Scale the marquee window must reach to cover the panel. Uniform, so the
   * 390x180 window has to scale by the *larger* of the two ratios (770/180)
   * — scaling by the width ratio would leave a horizontal band uncovered.
   */
  coverScale: 770 / 180,
  /**
   * Progress window over which the heading flips from ink to cream. The rect
   * underneath is dark imagery, so the heading has to change contrast with it.
   */
  flipFrom: 0.12,
  flipTo: 0.6,
} as const;