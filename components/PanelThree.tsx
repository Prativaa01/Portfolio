import { PhotoSlot } from "./PhotoSlot";

/**
 * Portrait placeholder motif from Figma `Frame 34` (`node 8066:546`):
 * 215x295 rect with a diagonal, stroke #565448.
 */
function PortraitPlaceholder() {
  return (
    <svg
      width="215"
      height="295"
      viewBox="0 0 215 295"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.5" y="0.5" width="214" height="294" stroke="#565448" />
      <path d="M1.5 1L214 294.5" stroke="#565448" />
    </svg>
  );
}

export function PanelThree() {
  return (
    <section
      className="relative h-full shrink-0 bg-cream"
      style={{ width: 1566 }}
      aria-label="Photograph"
    >
      {/* Photo: designer-supplied "my photo" (public/photos/myself-at-work.png,
          1086x1448). Slot is 741x770, so object-cover centre-crops ~160px top
          and bottom — hiding the table pen and excess headroom, matching the
          tighter Image-2 framing (face + laptop + glasses). */}
      <PhotoSlot
        src="/photos/myself-at-work.png"
        alt="Prativa Dahal at her laptop"
        width={1086}
        height={1448}
        className="absolute left-[115px] top-0 h-full w-[741px] [&>img]:object-[50%_50%]"
      />

      <div className="absolute left-[1098px] top-[238px]">
        <PortraitPlaceholder />
      </div>
    </section>
  );
}
