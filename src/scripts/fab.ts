import { stripBase } from "@/utils/url";

const RING_PERIMETER = 238;
const SETTLE_DELAY_MS = 260;
const SCROLL_TOP_THRESHOLD = 320;

interface FabElements {
  root: HTMLElement | null;
  toggle: HTMLElement | null;
  menu: HTMLElement | null;
  iconMenu: HTMLElement | null;
  iconClose: HTMLElement | null;
  ring: SVGElement | null;
  ringTrack: SVGElement | null;
  topBtn: HTMLElement | null;
}

let initialized = false;
let settleTimer = 0;

function queryFabElements(): FabElements {
  return {
    root: document.getElementById("fab-root"),
    toggle: document.getElementById("fab-toggle"),
    menu: document.getElementById("fab-menu"),
    iconMenu: document.getElementById("fab-icon-menu"),
    iconClose: document.getElementById("fab-icon-close"),
    ring: document.getElementById("fab-progress-ring") as SVGElement | null,
    ringTrack: document.getElementById("fab-ring-track") as SVGElement | null,
    topBtn: document.getElementById("fab-top"),
  };
}

function isFabOpen(): boolean {
  const { toggle } = queryFabElements();
  return toggle?.getAttribute("aria-expanded") === "true";
}

function setFabOpen(next: boolean): void {
  const { toggle, menu, iconMenu, iconClose, ring, ringTrack } =
    queryFabElements();
  if (!toggle || !menu) return;

  window.clearTimeout(settleTimer);
  toggle.setAttribute("aria-expanded", String(next));
  menu.setAttribute("aria-hidden", String(!next));
  menu.setAttribute("data-open", String(next));
  menu.setAttribute("data-settled", "false");

  const rx: string = next ? "32" : "24";
  ring?.setAttribute("rx", rx);
  ringTrack?.setAttribute("rx", rx);

  menu.classList.toggle("opacity-100", next);
  menu.classList.toggle("pointer-events-auto", next);
  menu.classList.toggle("opacity-0", !next);
  menu.classList.toggle("pointer-events-none", !next);

  iconMenu?.classList.toggle("hidden", next);
  iconClose?.classList.toggle("hidden", !next);

  if (next) {
    settleTimer = window.setTimeout(() => {
      menu.setAttribute("data-settled", "true");
    }, SETTLE_DELAY_MS);
  }
}

function syncActiveFabRoute(): void {
  const path: string = stripBase(window.location.pathname);
  document.querySelectorAll<HTMLElement>("[data-fab-item]").forEach((el) => {
    const rawHref: string | null = el.getAttribute("data-fab-href");
    if (!rawHref) return;
    const href: string = stripBase(rawHref);
    const isActive: boolean =
      href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
    el.setAttribute("data-active", String(isActive));
  });
}

function updateFabScrollProgress(): void {
  const { ring, topBtn } = queryFabElements();
  const maxScroll: number =
    document.documentElement.scrollHeight - window.innerHeight;
  const ratio: number =
    maxScroll > 40 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

  if (ring) {
    ring.style.strokeDashoffset = String(RING_PERIMETER * (1 - ratio));
  }
  if (topBtn) {
    const showTop: boolean = window.scrollY > SCROLL_TOP_THRESHOLD;
    topBtn.classList.toggle("hidden", !showTop);
    topBtn.classList.toggle("flex", showTop);
  }
}

function bindFabMagnetic(): void {
  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  const { toggle } = queryFabElements();
  if (!toggle || toggle.dataset.magneticBound === "1") return;
  toggle.dataset.magneticBound = "1";

  toggle.addEventListener("pointermove", (event: PointerEvent) => {
    const rect: DOMRect = toggle.getBoundingClientRect();
    const dx: number = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy: number = (event.clientY - (rect.top + rect.height / 2)) * 0.16;
    toggle.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  });

  toggle.addEventListener("pointerleave", () => {
    toggle.style.transform = "";
  });
}

function handleFabClick(event: MouseEvent): void {
  const target: EventTarget | null = event.target;
  if (!(target instanceof Element)) return;

  if (target.closest("#fab-toggle")) {
    setFabOpen(!isFabOpen());
    return;
  }

  if (target.closest("#fab-theme")) {
    window.__toggleTheme?.(event.clientX, event.clientY);
    return;
  }

  if (target.closest("#fab-search")) {
    setFabOpen(false);
    window.__openCommandPalette?.();
    return;
  }

  if (target.closest("#fab-top")) {
    setFabOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const { root } = queryFabElements();
  if (isFabOpen() && root && !root.contains(target)) {
    setFabOpen(false);
  }
}

export function initFab(): void {
  if (!initialized) {
    initialized = true;

    document.addEventListener("click", handleFabClick);
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFabOpen()) {
        setFabOpen(false);
      }
    });

    window.addEventListener("scroll", updateFabScrollProgress, { passive: true });
    window.addEventListener("resize", updateFabScrollProgress, { passive: true });

    document.addEventListener("astro:after-swap", () => {
      setFabOpen(false);
      bindFabMagnetic();
      syncActiveFabRoute();
      updateFabScrollProgress();
    });

    document.addEventListener("astro:page-load", () => {
      bindFabMagnetic();
      syncActiveFabRoute();
      updateFabScrollProgress();
    });
  }

  bindFabMagnetic();
  syncActiveFabRoute();
  updateFabScrollProgress();
}
