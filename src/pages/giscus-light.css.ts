import type { APIRoute } from "astro";
import { siteConfig } from "@/site.config";
import { buildGiscusLightCss } from "@/utils/giscusTheme";

export const GET: APIRoute = () => {
  return new Response(buildGiscusLightCss(siteConfig.theme), {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
    },
  });
};
