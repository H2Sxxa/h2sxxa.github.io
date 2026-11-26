import type { GiscusCommentsConfig } from "@/types/config";

interface TocHeadingItem {
  readonly id: string;
  readonly link: HTMLAnchorElement;
  readonly element: HTMLElement;
}

const GISCUS_ORIGIN = "https://giscus.app";
const COPY_FEEDBACK_MS = 1800;
const TOC_SCROLL_OFFSET = 120;

let listenersBound = false;
let giscusThemesPrefetched = false;
let activeTocScrollHandler: (() => void) | null = null;
let activeGiscusConfig: GiscusCommentsConfig | null = null;

function parseGiscusConfig(
  container: HTMLElement,
): GiscusCommentsConfig | null {
  const raw: string | undefined = container.dataset.giscusConfig;
  if (!raw) return null;
  return JSON.parse(raw) as GiscusCommentsConfig;
}

function getGiscusTheme(config: GiscusCommentsConfig): string {
  const isDark: boolean = document.documentElement.classList.contains("dark");
  if (window.location.protocol === "https:") {
    const cssPath: string = isDark
      ? config.theme.darkCss
      : config.theme.lightCss;
    return new URL(cssPath, window.location.origin).href;
  }
  return isDark ? config.theme.fallbackDark : config.theme.fallbackLight;
}

function prefetchGiscusThemes(config: GiscusCommentsConfig): void {
  if (giscusThemesPrefetched || window.location.protocol !== "https:") return;
  giscusThemesPrefetched = true;
  for (const cssPath of [config.theme.lightCss, config.theme.darkCss]) {
    const link: HTMLLinkElement = document.createElement("link");
    link.rel = "prefetch";
    link.as = "style";
    link.href = new URL(cssPath, window.location.origin).href;
    document.head.appendChild(link);
  }
}

function loadGiscus(): void {
  const container: HTMLElement | null =
    document.getElementById("giscus-comments");
  if (!container || container.dataset.loaded === "1") return;

  const config: GiscusCommentsConfig | null = parseGiscusConfig(container);
  if (!config) return;

  activeGiscusConfig = config;
  container.dataset.loaded = "1";
  container.innerHTML = "";

  prefetchGiscusThemes(config);

  const script: HTMLScriptElement = document.createElement("script");
  script.src = `${GISCUS_ORIGIN}/client.js`;
  script.setAttribute("data-repo", config.repo);
  script.setAttribute("data-repo-id", config.repoId);
  script.setAttribute("data-category", config.category);
  script.setAttribute("data-category-id", config.categoryId);
  script.setAttribute("data-mapping", config.mapping);
  script.setAttribute("data-strict", config.strict ? "1" : "0");
  script.setAttribute(
    "data-reactions-enabled",
    config.reactionsEnabled ? "1" : "0",
  );
  script.setAttribute("data-emit-metadata", config.emitMetadata ? "1" : "0");
  script.setAttribute("data-input-position", config.inputPosition);
  script.setAttribute("data-theme", getGiscusTheme(config));
  script.setAttribute("data-lang", config.lang);
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;

  container.appendChild(script);
}

function syncGiscusTheme(): void {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    "iframe.giscus-frame",
  );
  if (!iframe?.contentWindow || !activeGiscusConfig) return;

  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: getGiscusTheme(activeGiscusConfig) } } },
    GISCUS_ORIGIN,
  );
}

const COPY_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

function enhanceCodeBlocks(): void {
  const prefersReducedMotion: boolean = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.querySelectorAll<HTMLPreElement>(".prose pre").forEach((pre) => {
    if (pre.dataset.copyEnhanced === "1" || !pre.parentNode) return;
    pre.dataset.copyEnhanced = "1";

    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.className = "group/code relative my-6";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    pre.classList.add("my-0!");

    const button: HTMLButtonElement = document.createElement("button");
    button.type = "button";
    button.dataset.copied = "false";
    button.setAttribute("aria-label", "Copy code");
    button.className =
      "m3-pill group/copy absolute top-2.5 right-2.5 z-10 inline-flex cursor-pointer items-center gap-1.5 border border-border bg-background/85 px-2.5 py-1 font-mono text-[11px] font-medium text-muted-foreground opacity-70 backdrop-blur-xs transition-[opacity,background-color,border-color,color,border-radius,transform] duration-200 group-hover/code:opacity-100 hover:border-primary/50 hover:bg-accent hover:text-foreground data-[copied=true]:border-primary/60 data-[copied=true]:bg-accent data-[copied=true]:text-primary data-[copied=true]:opacity-100";

    button.innerHTML = `<span class="relative inline-flex h-3.5 w-3.5 items-center justify-center"><span class="absolute inset-0 inline-flex items-center justify-center transition-[transform,opacity] duration-250 ease-(--ease-spring) group-data-[copied=true]/copy:scale-50 group-data-[copied=true]/copy:rotate-45 group-data-[copied=true]/copy:opacity-0">${COPY_ICON_SVG}</span><span class="absolute inset-0 inline-flex scale-50 -rotate-45 items-center justify-center opacity-0 transition-[transform,opacity] duration-250 ease-(--ease-spring) group-data-[copied=true]/copy:scale-100 group-data-[copied=true]/copy:rotate-0 group-data-[copied=true]/copy:opacity-100">${CHECK_ICON_SVG}</span></span><span data-copy-label>Copy</span>`;

    const labelEl: HTMLElement | null =
      button.querySelector<HTMLElement>("[data-copy-label]");
    let resetTimer = 0;

    button.addEventListener("click", async () => {
      const codeText: string =
        pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      window.clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(codeText);
        button.dataset.copied = "true";
        if (labelEl) labelEl.textContent = "Copied";
        if (!prefersReducedMotion) {
          button.animate(
            [
              { transform: "scale(0.92)" },
              { transform: "scale(1.05)" },
              { transform: "scale(1)" },
            ],
            {
              duration: 280,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
          );
        }
        resetTimer = window.setTimeout(() => {
          button.dataset.copied = "false";
          if (labelEl) labelEl.textContent = "Copy";
        }, COPY_FEEDBACK_MS);
      } catch {
        if (labelEl) labelEl.textContent = "Failed";
      }
    });

    wrapper.appendChild(button);
  });
}

function enhanceLightbox(): void {
  const lightbox: HTMLElement | null =
    document.getElementById("article-lightbox");
  const lightboxImg = document.getElementById(
    "article-lightbox-img",
  ) as HTMLImageElement | null;
  if (!lightbox || !lightboxImg) return;

  const close = (): void => {
    lightbox.classList.remove("opacity-100");
    lightbox.classList.add("opacity-0", "pointer-events-none");
    lightboxImg.classList.remove("scale-100");
    lightboxImg.classList.add("scale-95");
    window.setTimeout(() => {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
    }, 180);
  };

  const open = (src: string, alt: string): void => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.remove("hidden", "pointer-events-none");
    lightbox.classList.add("flex");
    requestAnimationFrame(() => {
      lightbox.classList.remove("opacity-0");
      lightbox.classList.add("opacity-100");
      lightboxImg.classList.remove("scale-95");
      lightboxImg.classList.add("scale-100");
    });
  };

  if (lightbox.dataset.bound !== "1") {
    lightbox.dataset.bound = "1";
    lightbox.addEventListener("click", close);
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
        close();
      }
    });
  }

  document.querySelectorAll<HTMLImageElement>(".prose img").forEach((img) => {
    if (img.dataset.lightboxBound === "1") return;
    img.dataset.lightboxBound = "1";
    img.classList.add("cursor-zoom-in");
    img.addEventListener("click", () => open(img.currentSrc || img.src, img.alt));
  });
}

function enhanceToc(): void {
  if (activeTocScrollHandler) {
    window.removeEventListener("scroll", activeTocScrollHandler);
    activeTocScrollHandler = null;
  }

  const tocList: HTMLElement | null =
    document.getElementById("desktop-toc-list");
  const rail: HTMLElement | null = document.getElementById("toc-active-rail");
  if (!tocList || !rail) return;

  const links: HTMLAnchorElement[] = Array.from(
    tocList.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"),
  );
  const headings: TocHeadingItem[] = [];
  for (const link of links) {
    const id: string | null = link.getAttribute("data-toc-link");
    if (!id) continue;
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
      headings.push({ id, link, element });
    }
  }
  if (headings.length === 0) return;

  const setActive = (activeId: string): void => {
    let matched: HTMLAnchorElement | null = null;
    for (const item of headings) {
      const isActive: boolean = item.id === activeId;
      item.link.classList.toggle("text-primary", isActive);
      item.link.classList.toggle("font-medium", isActive);
      item.link.classList.toggle("text-muted-foreground", !isActive);
      if (isActive) {
        matched = item.link;
      }
    }

    if (matched) {
      const listRect: DOMRect = tocList.getBoundingClientRect();
      const linkRect: DOMRect = matched.getBoundingClientRect();
      const top: number = linkRect.top - listRect.top + 4;
      const height: number = Math.max(16, linkRect.height - 8);
      rail.style.transform = `translateY(${top}px)`;
      rail.style.height = `${height}px`;
      rail.style.opacity = "1";
    }
  };

  const onScroll = (): void => {
    let currentId: string = headings[0].id;
    for (const item of headings) {
      if (item.element.getBoundingClientRect().top <= TOC_SCROLL_OFFSET) {
        currentId = item.id;
      } else {
        break;
      }
    }
    setActive(currentId);
  };

  activeTocScrollHandler = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function hydrateArticlePage(): void {
  loadGiscus();
  enhanceCodeBlocks();
  enhanceLightbox();
  enhanceToc();
}

export function initArticleReader(): void {
  if (!listenersBound) {
    listenersBound = true;
    window.addEventListener("theme-change", syncGiscusTheme);
    document.addEventListener("astro:page-load", hydrateArticlePage);
  }
  hydrateArticlePage();
}
