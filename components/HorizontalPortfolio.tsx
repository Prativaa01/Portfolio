"use client";

import { useEffect, useRef, useState } from "react";
import { PanelOne } from "./PanelOne";
import { PanelTwo } from "./PanelTwo";
import { PanelThree } from "./PanelThree";
import { WorksMenu } from "./WorksMenu";
import { MobileAbout } from "./MobileAbout";
import { useStudy } from "./StudyContext";
import { DESIGN } from "@/lib/content";

/**
 * Breakpoint shared with Tailwind's `md:` — the mobile/desktop switch.
 */
const DESKTOP_QUERY = "(min-width: 768px)";

export function HorizontalPortfolio() {
  const [scale, setScale] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  // The landing "View all work" link arrives with `?view=work`; open the
  // menu already scrolled to the ALL WORK panel.
  const [menuStartAtWorks, setMenuStartAtWorks] = useState(false);
  const { study, openStudy } = useStudy();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "work") {
      setMenuStartAtWorks(true);
      setMenuOpen(true);
    }
  }, []);

  useEffect(() => {
    const update = () =>
      setScale(Math.max(0.4, window.innerHeight / DESIGN.frameHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      // The desktop frame only owns the wheel while it is actually laid
      // out; on narrow windows the mobile layout handles page scroll.
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      const isTrackpad = Math.abs(event.deltaY) < 50;
      el.scrollLeft += delta * (isTrackpad ? 1 : 1.5);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        el.scrollBy({ left: window.innerWidth * 0.75, behavior: "smooth" });
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        el.scrollBy({ left: -window.innerWidth * 0.75, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Mobile: stacked vertical sections. */}
      <div className="md:hidden">
        <MobileAbout onMenuOpen={() => setMenuOpen(true)} />
      </div>
      {/* Desktop: the scaled horizontal design frame. */}
      <div
        ref={scrollerRef}
        className="hidden h-screen w-full items-center overflow-x-auto overflow-y-hidden md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          style={{
            width: DESIGN.frameWidth * scale,
            height: DESIGN.frameHeight * scale,
          }}
          className="relative shrink-0"
        >
          <div
            style={{
              width: DESIGN.frameWidth,
              height: DESIGN.frameHeight,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="flex absolute left-0 top-0"
          >
            <PanelOne onMenuOpen={() => setMenuOpen(true)} />
            <PanelTwo />
            <PanelThree />
          </div>
        </div>
      </div>
      <WorksMenu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          setMenuStartAtWorks(false);
        }}
        startAtWorks={menuStartAtWorks}
        onOpenStudy={openStudy}
        inactive={study !== null}
      />
    </>
  );
}
