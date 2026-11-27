import type {
  TransitionBeforePreparationEvent,
  TransitionBeforeSwapEvent,
} from "astro:transitions/client";
import type { TopLevelRouteConfig } from "@/types/config";
import { stripBase } from "@/utils/url";
import { startM3eLoader, stopM3eLoader } from "./m3eLoader";

interface TopLevelRouteMeta {
  readonly section: string;
  readonly label: string;
  readonly index: string;
}

const STRIP_DURATION_MS = 440;
const STRIP_STAGGER_MS = 55;
const STRIP_EASING = "cubic-bezier(0.85, 0.15, 0.2, 1)";

let initialized = false;
let activeCurtain = false;
let runToken = 0;
let pendingViewTransition: ViewTransition | null = null;
let topLevelRoutes: Readonly<Record<string, TopLevelRouteMeta>> = {};

function lockScroll(): void {
  document.documentElement.classList.add("curtain-locked");
}

function unlockScroll(): void {
  document.documentElement.classList.remove("curtain-locked");
}

function normalizePath(pathname: string): string {
  return stripBase(pathname);
}

function getSection(pathname: string): string {
  const normalized: string = normalizePath(pathname);
  if (normalized === "/") return "home";
  return normalized.split("/")[1] || "home";
}

function parseTopLevelRoutes(): Readonly<Record<string, TopLevelRouteMeta>> {
  const dataEl: HTMLElement | null =
    document.getElementById("route-curtain-data");
  if (!dataEl?.textContent) {
    return {};
  }
  const routes = JSON.parse(dataEl.textContent) as readonly TopLevelRouteConfig[];
  const routeMap: Record<string, TopLevelRouteMeta> = {};
  routes.forEach((route, idx) => {
    const normalizedPath: string = normalizePath(route.path);
    routeMap[normalizedPath] = {
      section: route.section ?? getSection(normalizedPath),
      label: route.label,
      index: route.index ?? String(idx + 1).padStart(2, "0"),
    };
  });
  return routeMap;
}

function queryOverlay(): HTMLElement | null {
  return document.getElementById("route-transition-overlay");
}

function queryStrips(overlay: HTMLElement): HTMLElement[] {
  return Array.from(overlay.querySelectorAll<HTMLElement>("[data-rt-strip]"));
}

function cancelStripAnimations(strips: readonly HTMLElement[]): void {
  strips.forEach((strip) => {
    strip.getAnimations().forEach((anim) => anim.cancel());
  });
}

function animateStrips(
  overlay: HTMLElement,
  fromClip: string,
  toClip: string,
): Promise<void[]> {
  const strips: HTMLElement[] = queryStrips(overlay);
  cancelStripAnimations(strips);
  const animations: Animation[] = strips.map((strip, idx) =>
    strip.animate([{ clipPath: fromClip }, { clipPath: toClip }], {
      duration: STRIP_DURATION_MS,
      delay: idx * STRIP_STAGGER_MS,
      easing: STRIP_EASING,
      fill: "forwards",
    }),
  );
  return Promise.all(
    animations.map((anim) =>
      anim.finished.then(
        () => undefined,
        () => undefined,
      ),
    ),
  );
}

function setRouteCopy(
  overlay: HTMLElement,
  meta: TopLevelRouteMeta,
  path: string,
): void {
  overlay.querySelectorAll<HTMLElement>("[data-rt-label]").forEach((el) => {
    el.textContent = meta.label;
  });
  overlay.querySelectorAll<HTMLElement>("[data-rt-index]").forEach((el) => {
    el.textContent = meta.index;
  });
  overlay.querySelectorAll<HTMLElement>("[data-rt-path]").forEach((el) => {
    el.textContent = path;
  });
}

function resetToIdle(overlay: HTMLElement): void {
  stopM3eLoader();
  const strips: HTMLElement[] = queryStrips(overlay);
  cancelStripAnimations(strips);
  strips.forEach((strip) => {
    strip.style.clipPath = "inset(0 100% 0 0)";
  });
  overlay.classList.add("is-idle");
  document.documentElement.classList.remove("curtain-active");
  unlockScroll();
}

export function initRouteCurtain(): void {
  if (initialized) return;
  initialized = true;
  topLevelRoutes = parseTopLevelRoutes();

  document.addEventListener("astro:before-preparation", (rawEvent: Event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const event = rawEvent as TransitionBeforePreparationEvent;
    const fromPath: string = normalizePath(
      event.from?.pathname || window.location.pathname,
    );
    const toPath: string = normalizePath(event.to?.pathname || "");

    const toMeta: TopLevelRouteMeta | undefined = topLevelRoutes[toPath];
    if (!toMeta || getSection(fromPath) === toMeta.section) return;

    const overlay: HTMLElement | null = queryOverlay();
    if (!overlay) return;

    const token: number = ++runToken;
    activeCurtain = true;
    lockScroll();
    document.documentElement.classList.add("curtain-active");
    setRouteCopy(overlay, toMeta, toPath);

    overlay.classList.add("is-idle");
    void overlay.offsetWidth;
    overlay.classList.remove("is-idle");
    startM3eLoader(overlay);

    const coverPromise: Promise<void[]> = animateStrips(
      overlay,
      "inset(0 100% 0 0)",
      "inset(0 0 0 0)",
    );

    const originalLoader = event.loader;
    event.loader = async () => {
      await Promise.all([originalLoader(), coverPromise]);
      if (token === runToken) {
        queryStrips(overlay).forEach((strip) => {
          strip.style.clipPath = "inset(0 0 0 0)";
        });
      }
    };
  });

  document.addEventListener("astro:before-swap", (rawEvent: Event) => {
    if (!activeCurtain) return;
    const event = rawEvent as TransitionBeforeSwapEvent;
    event.newDocument.documentElement.classList.add(
      "curtain-active",
      "curtain-locked",
    );
    pendingViewTransition = event.viewTransition ?? null;
  });

  document.addEventListener("astro:after-swap", () => {
    if (!activeCurtain) return;
    try {
      pendingViewTransition?.skipTransition();
    } catch {
      // Transition may already be finished or skipped.
    }
  });

  document.addEventListener("astro:page-load", async () => {
    if (!activeCurtain) return;
    const overlay: HTMLElement | null = queryOverlay();
    if (!overlay) {
      stopM3eLoader();
      activeCurtain = false;
      pendingViewTransition = null;
      document.documentElement.classList.remove("curtain-active");
      unlockScroll();
      return;
    }

    const token: number = runToken;
    const vt: ViewTransition | null = pendingViewTransition;
    pendingViewTransition = null;

    if (vt) {
      await vt.finished.catch(() => undefined);
    }
    if (token !== runToken) return;

    document.documentElement.classList.remove("curtain-active");
    await new Promise<number>((resolve) => requestAnimationFrame(resolve));
    if (token !== runToken) return;

    await animateStrips(overlay, "inset(0 0 0 0)", "inset(0 0 0 100%)");
    if (token === runToken) {
      resetToIdle(overlay);
      activeCurtain = false;
    }
  });
}
