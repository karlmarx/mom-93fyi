import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mom's Bed Bug Plan",
    short_name: "Bed Bug Plan",
    description: "Step-by-step help for the bed bug plan.",
    start_url: "/bedbug",
    scope: "/bedbug/",
    display: "standalone",
    background_color: "#FBF7F0",
    theme_color: "#FBF7F0",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
