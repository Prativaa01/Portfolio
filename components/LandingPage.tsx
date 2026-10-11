import { Frame } from "./landing/Frame";
import { HeroPanel } from "./landing/HeroPanel";
import { PersonPanel } from "./landing/PersonPanel";
import { WorkPanel } from "./landing/WorkPanel";
import { CaseStudiesPanel } from "./landing/CaseStudiesPanel";
import { ExpertiseGrid } from "./landing/ExpertiseGrid";
import { SocialsPanel } from "./landing/SocialsPanel";

export function LandingPage() {
  return (
    <Frame>
      <HeroPanel />
      <PersonPanel />
      <WorkPanel />
      <CaseStudiesPanel />
      <ExpertiseGrid />
      <SocialsPanel />
    </Frame>
  );
}