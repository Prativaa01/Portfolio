"use client";

const EXPERTISE = [
  {
    num: "01",
    title: "PRODUCT DESIGN",
    desc: "Apps and platforms shaped around clear flows, solid structure, and real user needs.",
    img: "/expertise/01-product-design.png",
  },
  {
    num: "02",
    title: "DIGITAL EXPERIENCES",
    desc: "Websites with considered layout, pacing, and interaction.",
    img: "/expertise/02-digital-experiences.png",
  },
  {
    num: "03",
    title: "MOTION DESIGN",
    desc: "Interface animation and prototypes that show how a product moves and feels.",
    img: "/expertise/03-motion-design.png",
  },
  {
    num: "04",
    title: "DESIGN SYSTEM",
    desc: "Component libraries and design tokens built for consistency, speed, and clean handoff.",
    img: "/expertise/04-design-system.png",
  },
];

export function ExpertisePanel() {
  return (
    <section
      className="relative h-full shrink-0 bg-ink text-cream"
      style={{ width: 2090 }}
      aria-label="Expertise"
    >
      <span className="absolute left-[60px] top-[60px] text-[24px] tracking-wide">
        EXPERTISE
      </span>

      <div className="absolute right-[60px] top-[60px] flex gap-6 text-[11px] tracking-[0.18em] opacity-80">
        <span>INSTAGRAM</span>
        <span>LINKEDIN</span>
        <span>BEHANCE</span>
        <span>TIKTOK</span>
      </div>

      <div className="absolute left-[60px] top-[160px] flex h-[450px] w-[1970px]">
        {EXPERTISE.map((e) => (
          <div
            key={e.num}
            className="group relative flex-1 border-l border-cream/15 px-10"
          >
            <span className="text-[24px]">{e.num}</span>
            <h3 className="absolute left-10 top-[220px] w-[220px] text-[14px] tracking-[0.14em]">
              {e.title}
            </h3>
            <p className="absolute bottom-0 left-10 w-[240px] text-[13px] leading-[19px] opacity-85">
              {e.desc}
            </p>

            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.img}
                alt={e.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="absolute bottom-[30px] right-[60px] text-[10px] tracking-[0.14em] opacity-60">
        *2026, PRATIVA DAHAL. ALL RIGHTS RESERVED
      </p>
    </section>
  );
}
