import type { MetadataRoute } from "next";
import { HOME_DESCRIPTION, PERSON_NAME, SITE_NAME, SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Product Designer in Kathmandu, Nepal`,
    short_name: SITE_NAME,
    description: HOME_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#d8d0bd",
    theme_color: "#11120d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/photos/profile.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
