"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HOME, PANEL_WIDTHS } from "@/lib/home";

const HERO_WIDTH = PANEL_WIDTHS[0];

/**
 * The hero has to cover the whole first screen, so pad it slightly past the
 * measured viewport width. Scrollbar gutters and sub-pixel differences
 * otherwise leave a sliver of the next panel showing at the right edge.
 */
const HERO_COVER_BUFFER = 32;

export type FrameMetrics = {
  scale: number;
  /**
   * Extra width the hero panel adds so it covers the whole first screen.
   * Every later panel shifts right by this much; nothing else moves.
   */
  heroFill: number;
};

const FrameContext = createContext<FrameMetrics>({ scale: 1, heroFill: 0 });

export function useFrameMetrics() {
  return useContext(FrameContext);
}

/**
 * Holds the 9916x770 design frame at 1:1 and scales it down to fit the
 * viewport height, converting vertical wheel input into horizontal scroll.
 *
 * The hero panel stretches to at least the viewport width so the opening view
 * is solid black — the other panels only come into view once you scroll.
 */
export function Frame({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setScale(Math.min(1, window.innerHeight / HOME.frameHeight));
      window.dispatchEvent(new Event("resize"));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Measured from the scroller's painted box rather than window.innerWidth:
  // clientWidth subtracts any scrollbar gutter, which would leave a sliver of
  // the next panel showing at the right edge on the first screen.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      el.scrollLeft += delta;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Viewport width measured in design px, so the hero always covers the fold.
  const heroFill =
    scale > 0 && viewportWidth > 0
      ? Math.max(0, viewportWidth / scale - HERO_WIDTH + HERO_COVER_BUFFER)
      : 0;
  const totalWidth = HOME.frameWidth + heroFill;

  return (
    <FrameContext.Provider value={{ scale, heroFill }}>
      <div
        ref={scrollerRef}
        className="flex h-screen w-full items-center overflow-x-auto overflow-y-hidden bg-ink [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative shrink-0"
          style={{
            width: totalWidth * scale,
            height: HOME.frameHeight * scale,
          }}
        >
          <div
            className="absolute left-0 top-0 flex"
            style={{
              width: totalWidth,
              height: HOME.frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </FrameContext.Provider>
  );
}