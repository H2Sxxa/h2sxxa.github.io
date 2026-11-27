import type { CommandPaletteLink } from "@/types/config";
import { withBase } from "@/utils/url";

interface PostEntry {
  readonly title: string;
  readonly href: string;
  readonly tags: readonly string[];
  readonly date: string;
}

interface PageEntry {
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

interface PaletteDataset {
  readonly posts: readonly PostEntry[];
  readonly pages: readonly PageEntry[];
  readonly links: readonly CommandPaletteLink[];
  readonly resultLimit: number;
}

interface PaletteItem {
  readonly group: string;
  readonly title: string;
  readonly subtitle: string;
  readonly keywords: string;
  readonly meta?: string;
  readonly href?: string;
  readonly run?: () => void;
}

interface PaletteElements {
  backdrop: HTMLElement | null;
  panel: HTMLElement | null;
  input: HTMLInputElement | null;
  list: HTMLElement | null;
}

const FALLBACK_RESULT_LIMIT = 18;

let initialized = false;
let isOpen = false;
let activeIndex = 0;
let resultLimit = FALLBACK_RESULT_LIMIT;
let allItems: readonly PaletteItem[] = [];
let filteredItems: readonly PaletteItem[] = [];

function queryElements(): PaletteElements {
  return {
    backdrop: document.getElementById("cmd-palette-backdrop"),
    panel: document.getElementById("cmd-palette-panel"),
    input: document.getElementById("cmd-palette-input") as HTMLInputElement | null,
    list: document.getElementById("cmd-palette-list"),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function parseDataset(): PaletteDataset {
  const dataEl: HTMLElement | null =
    document.getElementById("cmd-palette-data");
  if (!dataEl?.textContent) {
    return {
      posts: [],
      pages: [],
      links: [],
      resultLimit: FALLBACK_RESULT_LIMIT,
    };
  }
  return JSON.parse(dataEl.textContent) as PaletteDataset;
}

function buildItems(dataset: PaletteDataset): readonly PaletteItem[] {
  const actions: readonly PaletteItem[] = [
    {
      group: "Actions",
      title: "Toggle Theme (Light / Dark)",
      subtitle: "Switch appearance with radial transition",
      keywords: "theme dark light mode 主题 暗色 浅色",
      run: () => {
        window.__toggleTheme?.(window.innerWidth / 2, window.innerHeight / 2);
      },
    },
    {
      group: "Actions",
      title: "Read a Random Post",
      subtitle: "Jump to a surprise article",
      keywords: "random surprise 随机 文章",
      run: () => {
        if (dataset.posts.length === 0) return;
        const pick: PostEntry =
          dataset.posts[Math.floor(Math.random() * dataset.posts.length)];
        navigateTo(pick.href);
      },
    },
    {
      group: "Actions",
      title: "Browse All Tags",
      subtitle: "Explore articles by topic",
      keywords: "tags topics 标签 分类",
      href: withBase("/tag"),
    },
  ];

  const customItems: readonly PaletteItem[] = dataset.links.map((link) => ({
    group: link.group ?? "Links",
    title: link.title,
    subtitle: link.subtitle,
    keywords:
      link.keywords ?? `${link.title} ${link.subtitle} ${link.href}`,
    href: link.href,
  }));

  const pageItems: readonly PaletteItem[] = dataset.pages.map((page) => ({
    group: "Pages",
    title: page.title,
    subtitle: page.description,
    keywords: `${page.title} ${page.description} ${page.href}`,
    href: page.href,
  }));

  const postItems: readonly PaletteItem[] = dataset.posts.map((post) => ({
    group: "Posts",
    title: post.title,
    subtitle:
      post.tags.length > 0
        ? post.tags.map((t) => `#${t}`).join("  ")
        : "Article",
    meta: post.date,
    keywords: `${post.title} ${post.tags.join(" ")} ${post.date}`,
    href: post.href,
  }));

  return [...actions, ...customItems, ...pageItems, ...postItems];
}

function navigateTo(href: string): void {
  const anchor: HTMLAnchorElement = document.createElement("a");
  anchor.href = href;
  if (/^https?:\/\//.test(href)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function renderList(): void {
  const { list } = queryElements();
  if (!list) return;

  if (filteredItems.length === 0) {
    list.innerHTML =
      '<div class="px-4 py-8 text-center text-sm text-muted-foreground">No matching posts, pages, or commands.</div>';
    return;
  }

  let html = "";
  let currentGroup = "";

  filteredItems.forEach((item, idx) => {
    if (item.group !== currentGroup) {
      currentGroup = item.group;
      html += `<div class="px-3 pt-2.5 pb-1 font-mono text-[11px] font-medium text-muted-foreground">${escapeHtml(currentGroup)}</div>`;
    }
    const selected: boolean = idx === activeIndex;
    const rowClass: string = selected
      ? "bg-accent text-accent-foreground"
      : "text-foreground hover:bg-muted/70";
    const metaHtml: string = item.meta
      ? `<span class="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">${escapeHtml(item.meta)}</span>`
      : "";

    html += `
      <button
        type="button"
        data-cmd-index="${idx}"
        role="option"
        aria-selected="${selected}"
        class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${rowClass}"
      >
        <div class="min-w-0">
          <div class="truncate text-sm font-medium">${escapeHtml(item.title)}</div>
          <div class="truncate text-xs text-muted-foreground">${escapeHtml(item.subtitle)}</div>
        </div>
        ${metaHtml}
      </button>
    `;
  });

  list.innerHTML = html;
  list
    .querySelector<HTMLElement>(`[data-cmd-index="${activeIndex}"]`)
    ?.scrollIntoView({ block: "nearest" });
}

function filterItems(query: string): void {
  const normalized: string = query.trim().toLowerCase();
  if (!normalized) {
    filteredItems = allItems.slice(0, resultLimit);
  } else {
    const terms: string[] = normalized.split(/\s+/);
    filteredItems = allItems.filter((item) => {
      const haystack: string = item.keywords.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }
  activeIndex = 0;
  renderList();
}

function closePalette(): void {
  const { backdrop, panel } = queryElements();
  if (!backdrop || !panel || !isOpen) return;
  isOpen = false;
  backdrop.classList.remove("opacity-100");
  backdrop.classList.add("opacity-0", "pointer-events-none");
  panel.classList.remove("scale-100");
  panel.classList.add("scale-95");
  window.setTimeout(() => {
    if (!isOpen) {
      backdrop.classList.add("hidden");
      backdrop.classList.remove("flex");
    }
  }, 160);
}

function openPalette(): void {
  const { backdrop, panel, input } = queryElements();
  if (!backdrop || !panel || !input) return;
  isOpen = true;
  backdrop.classList.remove("hidden", "pointer-events-none");
  backdrop.classList.add("flex");
  requestAnimationFrame(() => {
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");
    panel.classList.remove("scale-95");
    panel.classList.add("scale-100");
  });
  input.value = "";
  filterItems("");
  input.focus();
}

function executeItem(item: PaletteItem | undefined): void {
  if (!item) return;
  closePalette();
  if (item.run) {
    item.run();
  } else if (item.href) {
    navigateTo(item.href);
  }
}

export function initCommandPalette(): void {
  if (initialized) return;
  initialized = true;

  const dataset: PaletteDataset = parseDataset();
  resultLimit = dataset.resultLimit > 0 ? dataset.resultLimit : FALLBACK_RESULT_LIMIT;
  allItems = buildItems(dataset);
  filteredItems = allItems;

  window.__openCommandPalette = openPalette;
  window.__closeCommandPalette = closePalette;

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isOpen) closePalette();
      else openPalette();
      return;
    }
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    } else if (event.key === "ArrowDown" && filteredItems.length > 0) {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % filteredItems.length;
      renderList();
    } else if (event.key === "ArrowUp" && filteredItems.length > 0) {
      event.preventDefault();
      activeIndex =
        (activeIndex - 1 + filteredItems.length) % filteredItems.length;
      renderList();
    } else if (event.key === "Enter") {
      event.preventDefault();
      executeItem(filteredItems[activeIndex]);
    }
  });

  document.addEventListener("input", (event: Event) => {
    const target: EventTarget | null = event.target;
    if (target instanceof HTMLInputElement && target.id === "cmd-palette-input") {
      filterItems(target.value);
    }
  });

  document.addEventListener("click", (event: MouseEvent) => {
    const target: EventTarget | null = event.target;
    if (target instanceof Element && target.closest("[data-open-cmd]")) {
      openPalette();
      return;
    }
    const { backdrop } = queryElements();
    if (!isOpen || !backdrop) return;
    if (target === backdrop) {
      closePalette();
      return;
    }
    const button: Element | null =
      target instanceof Element ? target.closest("[data-cmd-index]") : null;
    if (button) {
      const idx: number = Number(button.getAttribute("data-cmd-index"));
      executeItem(filteredItems[idx]);
    }
  });

  document.addEventListener("astro:before-swap", closePalette);
}
