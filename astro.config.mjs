// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import react from "@astrojs/react";

function resolveSiteAndBase() {
  if (process.env.SITE_URL || process.env.BASE_PATH) {
    return {
      site: process.env.SITE_URL || "https://h2sxxa.github.io",
      base: process.env.BASE_PATH || "/",
    };
  }

  const repoSlug = process.env.GITHUB_REPOSITORY;
  if (repoSlug && repoSlug.includes("/")) {
    const [owner, repo] = repoSlug.split("/");
    const isUserSite =
      repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    return {
      site: `https://${owner.toLowerCase()}.github.io`,
      base: isUserSite ? "/" : `/${repo}`,
    };
  }

  return {
    site: "https://h2sxxa.github.io",
    base: "/",
  };
}

const { site, base } = resolveSiteAndBase();

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    mdx(),
    sitemap(),
    icon({
      include: {
        mdi: ["*"],
      },
    }),
    react(),
  ],
  image: {
    domains: ["avatars.githubusercontent.com"],
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: {
              className: ["anchor"],
              ariaHidden: "true",
              ariaLabel: "Link to this section",
            },
          },
        ],
      ],
    }),
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Fira Sans",
      cssVariable: "--font-lato",
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Lora",
      cssVariable: "--font-lora",
      fallbacks: ["serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Fira Code",
      cssVariable: "--font-fira-code",
      fallbacks: ["monospace"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Dancing Script",
      cssVariable: "--font-dancing-script",
      fallbacks: ["cursive"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Roboto Flex",
      cssVariable: "--font-flex",
      weights: ["300 900"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Fraunces",
      cssVariable: "--font-serif-flex",
      weights: ["300 900"],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
