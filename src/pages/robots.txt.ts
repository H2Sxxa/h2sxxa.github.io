import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin: string = site ? site.origin : "";
  const sitemapLine: string = site
    ? `\nSitemap: ${new URL("sitemap-index.xml", site).href}`
    : "";

  const body: string = `# robots.txt${origin ? ` for ${origin}` : ""}

# Content Signals policy (https://contentsignals.org)
# search=yes: allow use for search indexing
# ai-input=yes: allow use as input for AI answers (RAG/grounding)
# ai-train=yes: allow use for training AI models
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

# AI crawlers (explicitly allowed)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /${sitemapLine}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
