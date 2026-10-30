"use client";

import { useState } from "react";
import { Frame } from "./landing/Frame";
import { HeroPanel } from "./landing/HeroPanel";
import { PersonPanel } from "./landing/PersonPanel";
import { WorkPanel } from "./landing/WorkPanel";
import { CaseStudiesPanel } from "./landing/CaseStudiesPanel";
import { ExpertiseGrid } from "./landing/ExpertiseGrid";
import { SocialsPanel } from "./landing/SocialsPanel";
import { WorksMenu } from "./WorksMenu";
import { useStudy } from "./StudyContext";

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { study, openStudy } = useStudy();

  return (
    <>
      {/* Floating Menu Button on Landing Page */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-8 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full border border-cream/20 bg-black/60 backdrop-blur-md text-cream hover:bg-cream/15 hover:border-cream/50 transition-all duration-300 font-ruda text-[12px] font-semibold tracking-[0.14em] cursor-pointer shadow-lg"
        aria-label="Open menu and portfolio"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>MENU</span>
      </button>

      <Frame>
        <HeroPanel />
        <PersonPanel />
        <WorkPanel />
        <CaseStudiesPanel />
        <ExpertiseGrid />
        <SocialsPanel />
      </Frame>

      <WorksMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenStudy={openStudy}
        inactive={study !== null}
      />
    </>
  );
}