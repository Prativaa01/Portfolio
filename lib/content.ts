/**
 * Geometry for the about-me horizontal scroller, read from the "Myself" frame
 * in the Figma export (scripts/figma-fetch.mjs; see design/figma-export.json).
 *
 * The frame contains three panels totalling 5926px. Expertise is NOT part of
 * this frame - it belongs to the landing page frame only.
 */
export const DESIGN = {
  frameWidth: 5926,
  frameHeight: 770,
  panelOneWidth: 1566,
  panelTwoWidth: 2794,
  panelThreeWidth: 1566,
} as const;

export const PHOTOS = {
  portrait: "/photos/portrait.jpg",
  portraitWide: "/photos/portrait-wide.jpg",
} as const;

export const COPY = {
  name: "PRATIVA DAHAL",
  year: "2026",
  statement:
    "I design digital products that solve real problems through clear systems and considered motion, creating work that feels simple to use and hard to forget.",
  columns: [
    "Good design should feel calm and easy to follow. I start by working out what's getting in people's way, then shape the details so the solution feels obvious.",
    "Across apps, websites, and brand systems, I keep one consistent logic underneath. Clear structure and careful motion carry through every screen.",
  ],
  philosophyLabel: "PHILOSOPHY",
  philosophyNote:
    "*A look at the roles, collaborations, and milestones that have shaped my approach to design and problem-solving.",
  photoCaption: "Area for photo",
} as const;