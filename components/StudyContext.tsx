"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CaremateStudy } from "./CaremateStudy";
import { CaremateCaseStudy } from "./CaremateCaseStudy";
import { ProleapStudy } from "./ProleapStudy";
import { AevaStudy } from "./AevaStudy";
import { AevaCaseStudy } from "./AevaCaseStudy";
import { ArkivaStudy } from "./ArkivaStudy";
import { ArkivaCaseStudy } from "./ArkivaCaseStudy";
import type { StudyKey } from "./WorksMenu";

type StudyContextValue = {
  study: StudyKey | null;
  openStudy: (key: StudyKey) => void;
  closeStudy: () => void;
};

const StudyContext = createContext<StudyContextValue>({
  study: null,
  openStudy: () => {},
  closeStudy: () => {},
});

export function useStudy() {
  return useContext(StudyContext);
}

/**
 * Mounts the case-study intro and full-study overlays once so both the
 * landing case-studies list and the menu's ALL WORK panel can open them.
 */
export function StudyProvider({ children }: { children: ReactNode }) {
  const [study, setStudy] = useState<StudyKey | null>(null);
  const openStudy = useCallback((key: StudyKey) => setStudy(key), []);
  const closeStudy = useCallback(() => setStudy(null), []);

  return (
    <StudyContext.Provider value={{ study, openStudy, closeStudy }}>
      {children}
      <CaremateStudy open={study === "caremate"} onClose={closeStudy} />
      <CaremateCaseStudy open={study === "caremate-full"} onClose={() => openStudy("caremate")} />
      <ProleapStudy open={study === "proleap"} onClose={closeStudy} />
      <AevaStudy open={study === "aeva"} onClose={closeStudy} />
      <AevaCaseStudy open={study === "aeva-full"} onClose={() => openStudy("aeva")} />
      <ArkivaStudy open={study === "arkiva"} onClose={closeStudy} />
      <ArkivaCaseStudy open={study === "arkiva-full"} onClose={() => openStudy("arkiva")} />
    </StudyContext.Provider>
  );
}
