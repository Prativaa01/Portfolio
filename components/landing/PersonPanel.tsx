import Image from "next/image";
import Link from "next/link";
import { HOME } from "@/lib/home";
import { Arrow } from "./Arrow";

export function PersonPanel() {
  const p = HOME.person;

  return (
    <section
      className="relative z-10 shrink-0 bg-cream text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
      aria-label="Person behind the pixel"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          left: p.heading.left,
          top: p.heading.boxTop,
          fontSize: p.heading.fontSize,
          lineHeight: `${p.heading.fontSize}px`,
        }}
      >
        PERSON BEHIND THE PIXEL
      </h2>

      {/* Figma lays the link and its arrow out as one flex row with a 15px
          gap, both aligned to the baseline of the 32px Ruda label. */}
      <div
        className="absolute flex items-end"
        style={{
          left: p.link.left,
          top: p.link.boxTop,
          gap: p.link.gap,
        }}
      >
        <Link
          href="/about-me"
          className="whitespace-nowrap font-ruda"
          style={{
            fontSize: p.link.fontSize,
            lineHeight: `${p.link.fontSize}px`,
          }}
        >
          Myself
        </Link>
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: p.link.arrowSize, height: p.link.arrowSize }}
        >
          <Arrow width={p.link.arrowSize} />
        </span>
      </div>

      {/* Placeholder sits behind and slightly larger than the photo, matching
          the two stacked rectangles in node 8066:481 / 8066:482. */}
      <div
        className="absolute bg-slot"
        style={{
          left: p.placeholder.left,
          top: p.placeholder.top,
          width: p.placeholder.width,
          height: p.placeholder.height,
        }}
      />
      <Image
        src="/photos/profile.png"
        alt="Portrait of Prativa Dahal"
        width={Math.round(p.photo.width)}
        height={Math.round(p.photo.height)}
        priority
        className="absolute object-cover object-bottom"
        style={{
          left: p.photo.left,
          top: p.photo.top,
          width: p.photo.width,
          height: p.photo.height,
        }}
      />
    </section>
  );
}