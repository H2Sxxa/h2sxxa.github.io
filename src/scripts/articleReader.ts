interface TocHeadingItem {
  readonly id: string;
  readonly link: HTMLAnchorElement;
  readonly element: HTMLElement;
}

const GISCUS_ORIGIN = "https://giscus.app";
const COPY_FEEDBACK_MS = 1800;
const TOC_SCROLL_OFFSET = 120;

let listenersBound = false;
let activeTocScrollHandler: (() => void) | null = null;

function getGiscusTheme(): "dark_dimmed" | "light" {
  return document.documentElement.classList.contains("dark")
    ? "dark_dimmed"
    : "light";
}

function loadGiscus(): void {
  const container: HTMLElement | null =
    document.getElementById("giscus-comments");
  if (!container || container.dataset.loaded === "1") return;
  container.dataset.loaded = "1";
  container.innerHTML = "";

  const script: HTMLScriptElement = document.createElement("script");
  script.src = `${GISCUS_ORIGIN}/client.js`;
  script.setAttribute("data-repo", "H2Sxxa/h2sxxa.github.io");
  script.setAttribute("data-repo-id", "R_kgDOSuttsw");
  script.setAttribute("data-category", "Announcements");
  script.setAttribute("data-category-id", "DIC_kwDOSutts84C-zu8");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", getGiscusTheme());
  script.setAttribute("data-lang", "zh-CN");
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;

  container.appendChild(script);
}

function syncGiscusTheme(): void {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    "iframe.giscus-frame",
  );
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: getGiscusTheme() } } },
    GISCUS_ORIGIN,
  );
}

function enhanceCodeBlocks(): void {
  document.querySelectorAll<HTMLPreElement>(".prose pre").forEach((pre) => {
    if (pre.dataset.copyEnhanced === "1") return;
    pre.dataset.copyEnhanced = "1";

    const button: HTMLButtonElement = document.createElement("button");
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");
    button.className =
      "m3-pill absolute top-2.5 right-2.5 cursor-pointer border border-border bg-background/85 px-2.5 py-1 font-mono text-[11px] font-medium text-muted-foreground opacity-80 backdrop-blur-xs hover:border-primary/50 hover:bg-accent hover:text-foreground hover:opacity-100";

    button.addEventListener("click", async () => {
      const codeText: string =
        pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      try {
        await navigator.clipboard.writeText(codeText);
        button.textContent = "Copied ✓";
        button.classList.add("border-primary/60", "text-primary");
        window.setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("border-primary/60", "text-primary");
        }, COPY_FEEDBACK_MS);
      } catch {
        button.textContent = "Failed";
      }
    });

    pre.appendChild(button);
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
