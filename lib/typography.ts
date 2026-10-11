/**
 * Vertical text placement.
 *
 * Every `INK_TOP` in lib/home.ts was measured from the 2x Figma export as the
 * top of the glyph ink (the cap line for uppercase, the ascender line for
 * mixed case) — not the top of the CSS box. To place ink at a known y we need
 * to know how far the browser pushes the glyphs down inside the line box.
 *
 *   inkTop = top + lineHeight/2 - fontSize * CAP_GAP
 *
 * so the helpers below invert that. CAP_GAP is (ascent+descent)/2 minus the
 * distance from the ascender to the cap line, expressed as a fraction of the
 * font size. Both are calibrated against the reference render; re-run the
 * compare step after changing fonts or sizes.
 */

const DISPLAY_CAP_GAP = 0.35;
const SANS_CAP_GAP = 0.37;

export function displayTop(
  inkTop: number,
  fontSize: number,
  lineHeight = fontSize,
): number {
  return inkTop - lineHeight / 2 + fontSize * DISPLAY_CAP_GAP;
}

export function sansTop(
  inkTop: number,
  fontSize: number,
  lineHeight = fontSize,
): number {
  return inkTop - lineHeight / 2 + fontSize * SANS_CAP_GAP;
}