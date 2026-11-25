const HIDE_DELAY_MS = 900;
const MIN_THUMB_HEIGHT_PX = 36;
const TRACK_INSET_PX = 4;

interface ScrollbarElements {
  track: HTMLElement | null;
  thumb: HTMLElement | null;
}

let initialized = false;
let hideTimer = 0;
let isDragging = false;
let isHovering = false;
let dragStartY = 0;
let dragStartScrollY = 0;
let resizeObserver: ResizeObserver | null = null;

function queryElements(): ScrollbarElements {
  return {
    track: document.getElementById("overlay-scrollbar-track"),
    thumb: document.getElementById("overlay-scrollbar-thumb"),
  };
}

function getScrollMetrics(): {
  maxScroll: number;
  viewportHeight: number;
  scrollHeight: number;
  trackHeight: number;
  thumbHeight: number;
  thumbTop: number;
} {
  const viewportHeight: number = window.innerHeight;
  const scrollHeight: number = document.documentElement.scrollHeight;
  const maxScroll: number = Math.max(0, scrollHeight - viewportHeight);
  const trackHeight: number = Math.max(0, viewportHeight - TRACK_INSET_PX * 2);

  if (maxScroll <= 1 || trackHeight <= 0) {
    return {
      maxScroll: 0,
      viewportHeight,
      scrollHeight,
      trackHeight,
      thumbHeight: 0,
      thumbTop: 0,
    };
  }

  const ratio: number = viewportHeight / scrollHeight;
  const thumbHeight: number = Math.max(
    MIN_THUMB_HEIGHT_PX,
    Math.min(trackHeight, Math.round(trackHeight * ratio)),
  );
  const maxThumbTravel: number = Math.max(1, trackHeight - thumbHeight);
  const scrollRatio: number = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  const thumbTop: number = scrollRatio * maxThumbTravel;

  return {
    maxScroll,
    viewportHeight,
    scrollHeight,
    trackHeight,
    thumbHeight,
    thumbTop,
  };
}

function scheduleHide(): void {
  window.clearTimeout(hideTimer);
  if (isDragging || isHovering) return;
  hideTimer = window.setTimeout(() => {
    const { track } = queryElements();
    track?.setAttribute("data-visible", "false");
  }, HIDE_DELAY_MS);
}

function showTrack(): void {
  const { track } = queryElements();
  if (!track) return;
  if (getScrollMetrics().maxScroll <= 1) {
    track.setAttribute("data-visible", "false");
    return;
  }
  track.setAttribute("data-visible", "true");
  scheduleHide();
}

function syncThumb(): void {
  const { track, thumb } = queryElements();
  if (!track || !thumb) return;

  const metrics = getScrollMetrics();
  if (metrics.maxScroll <= 1) {
    track.setAttribute("data-scrollable", "false");
    track.setAttribute("data-visible", "false");
    return;
  }

  track.setAttribute("data-scrollable", "true");
  thumb.style.height = `${metrics.thumbHeight}px`;
  thumb.style.transform = `translate3d(0, ${metrics.thumbTop.toFixed(1)}px, 0)`;
}

function observeBodySize(): void {
  resizeObserver?.disconnect();
  if (typeof ResizeObserver === "undefined") return;
  resizeObserver = new ResizeObserver(() => {
    syncThumb();
  });
  resizeObserver.observe(document.body);
}

export function initOverlayScrollbar(): void {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  if (!initialized) {
    initialized = true;

    window.addEventListener(
      "scroll",
      () => {
        syncThumb();
        showTrack();
      },
      { passive: true },
    );

    window.addEventListener("resize", syncThumb, { passive: true });

    document.addEventListener("pointerenter", (event: PointerEvent) => {
      const target: EventTarget | null = event.target;
      if (target instanceof Element && target.id === "overlay-scrollbar-track") {
        isHovering = true;
        showTrack();
      }
    }, true);

    document.addEventListener("pointerleave", (event: PointerEvent) => {
      const target: EventTarget | null = event.target;
      if (target instanceof Element && target.id === "overlay-scrollbar-track") {
        isHovering = false;
        scheduleHide();
      }
    }, true);

    document.addEventListener("pointerdown", (event: PointerEvent) => {
      const target: EventTarget | null = event.target;
      if (!(target instanceof Element)) return;

      const { track, thumb } = queryElements();
      if (!track || !thumb) return;

      if (target === thumb) {
        event.preventDefault();
        isDragging = true;
        dragStartY = event.clientY;
        dragStartScrollY = window.scrollY;
        track.setAttribute("data-dragging", "true");
        track.setAttribute("data-visible", "true");
        window.clearTimeout(hideTimer);
        thumb.setPointerCapture(event.pointerId);
        return;
      }

      if (target === track) {
        const metrics = getScrollMetrics();
        if (metrics.maxScroll <= 1) return;
        const rect: DOMRect = track.getBoundingClientRect();
        const clickOffset: number = event.clientY - rect.top - metrics.thumbHeight / 2;
        const maxTravel: number = Math.max(1, metrics.trackHeight - metrics.thumbHeight);
        const targetRatio: number = Math.min(1, Math.max(0, clickOffset / maxTravel));
        window.scrollTo({
          top: targetRatio * metrics.maxScroll,
          behavior: "smooth",
        });
      }
    });

    document.addEventListener("pointermove", (event: PointerEvent) => {
      if (!isDragging) return;
      const metrics = getScrollMetrics();
      if (metrics.maxScroll <= 1) return;
      const maxTravel: number = Math.max(1, metrics.trackHeight - metrics.thumbHeight);
      const deltaY: number = event.clientY - dragStartY;
      const nextScrollY: number =
        dragStartScrollY + (deltaY / maxTravel) * metrics.maxScroll;
      window.scrollTo({ top: nextScrollY, behavior: "instant" });
    });

    const endDrag = (): void => {
      if (!isDragging) return;
      isDragging = false;
      const { track } = queryElements();
      track?.setAttribute("data-dragging", "false");
      scheduleHide();
    };

    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    document.addEventListener("astro:page-load", () => {
      observeBodySize();
      syncThumb();
    });
  }

  observeBodySize();
  syncThumb();
}
