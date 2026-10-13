"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tracks how centred a panel is in the horizontal scroller, as 0 -> 1.
 *
 * The reference reveal is driven by scroll position, not time: the rect is
 * collapsed until the panel is nearly centred, so arriving at the panel *is*
 * the trigger. Distance is measured in design px so the reveal covers the same
 * amount of scrolling regardless of how far the frame is scaled down.
 *
 * Returns 1 when the panel's centre sits exactly on the viewport centre and
 * falls to 0 once it is `travel` design px away in either direction.
 */
export function useRevealProgress(
  ref: RefObject<HTMLElement | null>,
  travel: number,
) {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;

      // Design px -> screen px. The panel is inside a scaled subtree, so its
      // painted width already includes the frame's zoom.
      const screenPerDesign = rect.width / el.offsetWidth;
      const offset = rect.left + rect.width / 2 - window.innerWidth / 2;
      const reach = travel * screenPerDesign;

      setProgress(Math.min(1, Math.max(0, 1 - Math.abs(offset) / reach)));
    };

    const schedule = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        update();
      });
    };

    update();

    const scroller = el.closest<HTMLElement>("[data-frame-scroller]");
    scroller?.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      scroller?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, travel]);

  return progress;
}