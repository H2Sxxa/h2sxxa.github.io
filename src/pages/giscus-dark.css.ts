import type { APIRoute } from "astro";
import { siteConfig } from "@/site.config";
import { buildGiscusDarkCss } from "@/utils/giscusTheme";

export const GET: APIRoute = () => {
  return new Response(buildGiscusDarkCss(siteConfig.theme), {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
    },
  });
};
