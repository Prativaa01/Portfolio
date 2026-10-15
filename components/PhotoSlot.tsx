"use client";

import Image from "next/image";
import { useState } from "react";

type PhotoSlotProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function PhotoSlot({
  src,
  alt,
  width,
  height,
  className = "",
  sizes,
  priority = false,
}: PhotoSlotProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`photo-slot relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}