import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/partners/",
        "/home",
        "/memorials",
        "/preview",
        "/admin",
        "/login",
        "/invite",
        "/c/",
        "/settings",
        "/api/",
      ],
    },
  };
}
