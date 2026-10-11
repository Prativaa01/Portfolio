type ArrowProps = {
  width: number;
  height?: number;
  /** Rendered stroke width in CSS px — the SVG viewBox stays fixed. */
  stroke?: number;
};

/**
 * The right-arrow glyph used after "Myself" and "View all work". The design
 * renders it at two different sizes, so stroke is kept in rendered pixels via
 * a non-scaling stroke rather than being baked into the viewBox.
 */
export function Arrow({ width, height, stroke = 2 }: ArrowProps) {
  return (
    <svg
      width={width}
      height={height ?? width}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 12h18m0 0-7-7m7 7-7 7"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}