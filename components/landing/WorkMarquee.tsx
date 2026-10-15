"use client";

import { WorkCube } from "./WorkCube";

export function WorkMarquee({ reveal = 0 }: { reveal?: number }) {
  return <WorkCube reveal={reveal} />;
}

export { WorkCube };
