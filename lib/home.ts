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
   * Read from the live Figma file (`node 8066:472`): `left: 94px` /
   * `top: 66px` / `text-[208.236px]` / `#d8d0bd`, as two `leading-none`
   * lines over a `#11120D` background.
   *
   * `boxTop` is Figma's text box top — already a box coordinate, so it must
   * not go through displayTop. No `scaleX`: the design's condensed look comes
   * from Chamberi Headline ExtraLight, and compressing Cormorant to imitate
   * it was fighting the wrong problem.
   */
  hero: {
    left: 94,
    fontSize: 208.236,
    boxTop: 66,
  },

  /**
   * Read from the live Figma file (`node 8066:475`). Note the portrait is two
   * stacked layers: a `#d9d9d9` placeholder (357x412) sitting 10px lower and
   * 38px wider than the photo that covers it (319x422, `object-bottom`).
   */
  person: {
    heading: { left: 41, fontSize: 48, boxTop: 72 },
    link: { left: 478, fontSize: 32, boxTop: 632, gap: 15, arrowSize: 30 },
    placeholder: { left: 777, top: 310, width: 357, height: 412 },
    photo: { left: 777, top: 300, width: 319, height: 422 },
  },

  /**
   * Read from the live Figma file (`node 8066:484`), which specifies this as
   * `left: calc(50% - 476px)` / `top: 312px` / `text-[194px]` in
   * Chamberi Headline ExtraLight.
   *
   * The design centre-positions the heading rather than pinning a fixed
   * left edge, so it is expressed the same way here. `boxTop` is Figma's text
   * box top (already a box coordinate, so it must not go through displayTop).
   *
   * No `scaleX`: the condensed look came from the design's typeface, not a
   * transform, and compressing Cormorant to fake it was fighting the wrong
   * problem. Cormorant is simply wider than Chamberi at the same size.
   */
  work: { centreOffset: 476, fontSize: 194, boxTop: 312, width: 953 },

  /**
   * Read from the live Figma file (`node 8066:485`). The list is a real column
   * in the design — rows of text + rule separated by a 19px gap, with 27px
   * between rows — so it is modelled as spacing rather than per-item tops.
   * The panel background is `#d8d0bd`, not cream.
   */
  cases: {
    heading: { left: 91, fontSize: 48, boxTop: 100 },
    list: {
      left: 783,
      top: 167,
      width: 657,
      fontSize: 48,
      /** Space between an item's text and its underline. */
      ruleGap: 19,
      /** Space between one row and the next. */
      rowGap: 27,
      /** Height of the four text rows themselves (Ruda at 48, leading-none). */
      rowHeight: 48,
    },
    placeholder: { left: 91, top: 528, width: 361, height: 201 },
    footnote: { left: 783, fontSize: 16, boxTop: 691, lineHeight: 16 },
    viewAll: {
      left: 1296,
      fontSize: 24,
      boxTop: 695,
      arrow: { left: 1483, size: 24 },
    },
  },

  /**
   * Read from the live Figma file (`node 8066:474`): the label is pinned at
   * `left: calc(50% - 1156px)` / `top: 59px` / `text-[48px]` / `#fffaf4`.
   * In the 2394-wide panel that resolves to x=41. Expressed as a centre offset
   * so it tracks the panel exactly as Figma does.
   */
  expertise: {
    label: { centreOffset: 1156, fontSize: 48, boxTop: 59 },
    /**
     * Card geometry from the component itself (`node 8066:509`, 440x802).
     *
     * Figma places every card's copy at the SAME offset inside the card —
     * `calc(50% - 167px)` / top 40.5 for the number, `calc(50% - 16px)` for
     * the title, top 588.5 for the body. An earlier build staggered these
     * per card off the PNG export; the live file says they are identical, so
     * there is one set of positions here and no per-card array.
     */
    cardWidth: 440,
    cardBorderWidth: 0.5,
    borderLefts: [637, 1076, 1515, 1954, 2393.5],
    borderThickness: 1,
    numberFontSize: 64,
    numberLeft: 53,
    numberBoxTop: 40.5,
    titleFontSize: 32,
    titleBoxTop: 385,
    bodyFontSize: 24,
    bodyLineHeight: 24,
    bodyBoxTop: 588.5,
    /**
     * Each expertise PNG is a full-card hover mockup with "0n", the title and
     * the description baked in. Live and baked copy now share the same slot,
     * so only a small residual nudge is needed to bring them into register.
     */
    hoverTextShift: [9, -1.1, -4.8, -7.8],
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
    /**
     * Explicit line breaks from the component (`node 8066:628`), which sets the
     * description as three separate `leading-none` paragraphs. Storing them as
     * lines keeps the copy identical to the design instead of letting the
     * browser re-wrap it at whatever width the card happens to be.
     */
    descLines: [
      "Apps and platforms shaped ",
      "around clear flows, solid ",
      "structure, and real user needs.",
    ],
    img: "/expertise/01-product-design.png",
  },
  {
    num: "02",
    title: "DIGITAL EXPERIENCES",
    desc: "Websites with considered layout, pacing, and interaction.",
    descLines: [
      "Websites with considered ",
      "layout, pacing, and ",
      "interaction.",
    ],
    img: "/expertise/02-digital-experiences.png",
  },
  {
    num: "03",
    title: "MOTION DESIGN",
    desc: "Interface animation and prototypes that show how a product moves and feels.",
    descLines: [
      "Interface animation and ",
      "prototypes that show how ",
      "a product moves and feels.",
    ],
    img: "/expertise/03-motion-design.png",
  },
  {
    num: "04",
    title: "DESIGN SYSTEM",
    desc: "Component libraries and design tokens built for consistency, speed, and clean handoff.",
    descLines: [
      "Component libraries and ",
      "design tokens built for ",
      "consistency, speed, and clean handoff.",
    ],
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
   * The heading is CSS-centred, so both words travel the same distance to
   * reach their respective edges — a single symmetric value works. Measured
   * at fontSize 194 in Cormorant, the heading is 1004px wide inside the
   * 1566 panel, so its edge sits (1566 - 1004) / 2 = 281px from each side.
   * 261 lands each word 20px shy of the edge instead of clipping it.
   */
  splitX: 261,
  /**
   * How far the cluster grows. The 390x180 window scales uniformly, so this
   * is a single factor — 1.55 turns it into a ~605x280 group. Enough to read
   * as the work "opening up" with images popping into place, while keeping the
   * cluster contained: black type stays legible over a small group, which is
   * exactly how the design layers the words across the images.
   */
  coverScale: 1.55,
  /**
   * Base delay before the first tile pops up, plus the increment added per
   * tile index, in seconds. Small and cumulative so the cluster resolves as a
   * wave across the panel rather than everything arriving at once.
   */
  popStagger: 0.055,
  popStep: 0.035,
  /** How far each tile rises as it pops in, in design px. */
  popRise: 18,
} as const;