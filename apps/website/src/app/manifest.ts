import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FLASH - Lets Anyone Self Host",
    short_name: "FLASH",
    description: "Self-hosted Photo Event Management System",
    display: "fullscreen",
    icons: [
      { src: "/favicon-128x128.png", type: "image/png", sizes: "128x128" },
      { src: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { src: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { src: "/favicon.ico", type: "image/x-icon" },
    ],
  };
}
