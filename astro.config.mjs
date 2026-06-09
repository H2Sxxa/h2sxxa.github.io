// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap(), icon({
        include: {
            mdi: ["*"],
        }
    })],
    image: {
        domains: ['avatars.githubusercontent.com'],
    },
    markdown: {
        processor: unified({
            rehypePlugins: [
                rehypeHeadingIds,
                [rehypeAutolinkHeadings, {
                    behavior: "prepend", properties: {
                        className: ["anchor"],
                        ariaHidden: "true",
                        ariaLabel: "Link to this section",
                    }
                }],
            ],
        }),

    },
    fonts: [
        { provider: fontProviders.fontsource(), name: 'Fira Sans', cssVariable: '--font-lato', fallbacks: ['sans-serif'] },
        { provider: fontProviders.fontsource(), name: 'Lora', cssVariable: '--font-lora', fallbacks: ['serif'] },
        { provider: fontProviders.fontsource(), name: 'Fira Code', cssVariable: '--font-fira-code', fallbacks: ['monospace'] },
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});