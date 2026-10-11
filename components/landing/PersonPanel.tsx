import Image from "next/image";
import Link from "next/link";
import { HOME } from "@/lib/home";
import { displayTop, sansTop } from "@/lib/typography";
import { Arrow } from "./Arrow";

export function PersonPanel() {
  const p = HOME.person;

  return (
    <section
      className="relative shrink-0 bg-cream text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
      aria-label="Person behind the pixel"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          left: p.headingLeft,
          top: displayTop(p.headingInkTop, p.headingFontSize),
          fontSize: p.headingFontSize,
          lineHeight: `${p.headingFontSize}px`,
          transform: `scaleX(${p.headingScaleX})`,
          transformOrigin: "left center",
        }}
      >
        PERSON BEHIND THE PIXEL
      </h2>

      <Link
        href="/about-me"
        className="absolute whitespace-nowrap font-ruda"
        style={{
          left: p.linkLeft,
          top: sansTop(p.linkInkTop, p.linkFontSize),
          fontSize: p.linkFontSize,
          lineHeight: `${p.linkFontSize}px`,
        }}
      >
        Myself
      </Link>
      <span
        className="absolute flex items-center"
        style={{
          left: p.arrowLeft,
          top: sansTop(p.linkInkTop, p.linkFontSize),
          height: p.linkFontSize,
        }}
      >
        <Arrow width={p.arrowWidth} />
      </span>

      <div
        className="absolute bg-slot"
        style={{
          left: p.photo.left,
          top: p.photo.top,
          width: p.photo.width,
          height: p.photo.height,
        }}
      />
      <Image
        src="/photos/profile.png"
        alt="Portrait of Prativa Dahal"
        width={Math.round(p.photo.width)}
        height={Math.round(p.photo.height)}
        priority
        className="absolute object-cover"
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