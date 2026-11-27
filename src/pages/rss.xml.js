import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { siteConfig } from "@/site.config";
import { withBase } from "@/utils/url";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: withBase(`/blog/${post.id}/`),
    })),
  });
}
