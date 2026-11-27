import type { ThemeConfig } from "@/types/config";

function wrapHue(degrees: number): number {
  const normalized: number = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function resolveHues(theme: ThemeConfig): {
  readonly primary: number;
  readonly tertiary: number;
} {
  const primary: number = wrapHue(theme.hue);
  const tertiary: number = wrapHue(
    typeof theme.tertiaryHue === "number" ? theme.tertiaryHue : primary - 51,
  );
  return { primary, tertiary };
}

/**
 * Generates the light Giscus theme CSS synchronized with the configured OKLCH hues.
 */
export function buildGiscusLightCss(theme: ThemeConfig): string {
  const { primary, tertiary } = resolveHues(theme);
  const p = (offset: number): number => wrapHue(primary + offset);
  const t = (offset: number): number => wrapHue(tertiary + offset);

  return `/*!
 * Giscus Light Theme — OKLCH Hue-Driven Palette + M3 Expressive
 */

main {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Syntax highlighting */
  --color-prettylights-syntax-comment: oklch(0.54 0.03 ${p(-5)});
  --color-prettylights-syntax-constant: oklch(0.45 0.13 ${p(0)});
  --color-prettylights-syntax-entity: oklch(0.48 0.12 290);
  --color-prettylights-syntax-storage-modifier-import: oklch(0.26 0.03 ${p(1)});
  --color-prettylights-syntax-entity-tag: oklch(0.46 0.14 ${p(5)});
  --color-prettylights-syntax-keyword: oklch(0.52 0.16 24);
  --color-prettylights-syntax-string: oklch(0.46 0.12 195);
  --color-prettylights-syntax-variable: oklch(0.54 0.14 ${t(-8)});
  --color-prettylights-syntax-brackethighlighter-unmatched: oklch(0.55 0.18 24);
  --color-prettylights-syntax-invalid-illegal-text: oklch(0.99 0.008 ${p(-22)});
  --color-prettylights-syntax-invalid-illegal-bg: oklch(0.52 0.18 24);
  --color-prettylights-syntax-carriage-return-text: oklch(0.99 0.008 ${p(-22)});
  --color-prettylights-syntax-carriage-return-bg: oklch(0.55 0.18 24);
  --color-prettylights-syntax-string-regexp: oklch(0.46 0.14 ${p(5)});
  --color-prettylights-syntax-markup-list: oklch(0.54 0.14 ${t(0)});
  --color-prettylights-syntax-markup-heading: oklch(0.48 0.15 ${p(0)});
  --color-prettylights-syntax-markup-italic: oklch(0.24 0.03 ${p(1)});
  --color-prettylights-syntax-markup-bold: oklch(0.22 0.032 ${p(1)});
  --color-prettylights-syntax-markup-deleted-text: oklch(0.44 0.16 24);
  --color-prettylights-syntax-markup-deleted-bg: oklch(0.95 0.04 24);
  --color-prettylights-syntax-markup-inserted-text: oklch(0.36 0.13 ${p(1)});
  --color-prettylights-syntax-markup-inserted-bg: oklch(0.93 0.07 ${p(-5)});
  --color-prettylights-syntax-markup-changed-text: oklch(0.45 0.12 ${t(-2)});
  --color-prettylights-syntax-markup-changed-bg: oklch(0.94 0.08 ${t(10)});
  --color-prettylights-syntax-markup-ignored-text: oklch(0.45 0.038 ${p(-3)});
  --color-prettylights-syntax-markup-ignored-bg: oklch(0.94 0.02 ${p(-15)});
  --color-prettylights-syntax-meta-diff-range: oklch(0.48 0.12 290);
  --color-prettylights-syntax-brackethighlighter-angle: oklch(0.5 0.03 ${p(-3)});
  --color-prettylights-syntax-sublimelinter-gutter-mark: oklch(0.65 0.025 ${p(-7)});
  --color-prettylights-syntax-constant-other-reference-link: oklch(0.48 0.15 ${p(0)});

  /* Buttons */
  --color-btn-text: oklch(0.24 0.032 ${p(1)});
  --color-btn-bg: oklch(0.994 0.008 ${p(-27)});
  --color-btn-border: oklch(0.875 0.032 ${p(-11)});
  --color-btn-shadow: 0 1px 2px oklch(0.22 0.032 ${p(1)} / 0.04);
  --color-btn-inset-shadow: 0 0 #0000;
  --color-btn-hover-bg: oklch(0.915 0.088 ${p(-7)});
  --color-btn-hover-border: oklch(0.54 0.165 ${p(0)} / 0.45);
  --color-btn-active-bg: oklch(0.88 0.09 ${p(-5)});
  --color-btn-active-border: oklch(0.54 0.165 ${p(0)} / 0.6);
  --color-btn-selected-bg: oklch(0.915 0.088 ${p(-7)});

  /* Primary Button */
  --color-btn-primary-text: oklch(0.99 0.008 ${p(-22)});
  --color-btn-primary-bg: oklch(0.54 0.165 ${p(0)});
  --color-btn-primary-border: oklch(0.48 0.15 ${p(0)} / 0.4);
  --color-btn-primary-shadow: 0 2px 8px -2px oklch(0.54 0.165 ${p(0)} / 0.35);
  --color-btn-primary-inset-shadow: 0 0 #0000;
  --color-btn-primary-hover-bg: oklch(0.49 0.16 ${p(0)});
  --color-btn-primary-hover-border: oklch(0.44 0.15 ${p(0)} / 0.5);
  --color-btn-primary-selected-bg: oklch(0.46 0.155 ${p(0)});
  --color-btn-primary-selected-shadow: 0 0 #0000;
  --color-btn-primary-disabled-text: oklch(0.99 0.008 ${p(-22)} / 0.72);
  --color-btn-primary-disabled-bg: oklch(0.54 0.165 ${p(0)} / 0.48);
  --color-btn-primary-disabled-border: oklch(0.54 0.165 ${p(0)} / 0.2);

  /* Controls & Lists */
  --color-action-list-item-default-hover-bg: oklch(0.915 0.088 ${p(-7)} / 0.55);
  --color-segmented-control-bg: oklch(0.942 0.022 ${p(-15)});
  --color-segmented-control-button-bg: oklch(0.994 0.008 ${p(-27)});
  --color-segmented-control-button-selected-border: oklch(0.54 0.165 ${p(0)} / 0.45);

  /* Foregrounds & Surfaces */
  --color-fg-default: oklch(0.22 0.032 ${p(1)});
  --color-fg-muted: oklch(0.45 0.038 ${p(-3)});
  --color-fg-subtle: oklch(0.56 0.032 ${p(-5)});
  --color-canvas-default: transparent;
  --color-canvas-overlay: oklch(0.994 0.008 ${p(-27)});
  --color-canvas-inset: oklch(0.955 0.018 ${p(-19)});
  --color-canvas-subtle: oklch(0.994 0.008 ${p(-27)});

  /* Borders & Neutrals */
  --color-border-default: oklch(0.875 0.032 ${p(-11)});
  --color-border-muted: oklch(0.905 0.024 ${p(-13)});
  --color-neutral-muted: oklch(0.905 0.045 ${p(-7)} / 0.55);

  /* Semantic Accents */
  --color-accent-fg: oklch(0.50 0.16 ${p(0)});
  --color-accent-emphasis: oklch(0.54 0.165 ${p(0)});
  --color-accent-muted: oklch(0.54 0.165 ${p(0)} / 0.35);
  --color-accent-subtle: oklch(0.915 0.088 ${p(-7)} / 0.65);

  --color-success-fg: oklch(0.48 0.155 140);
  --color-attention-fg: oklch(0.56 0.145 ${t(0)});
  --color-attention-muted: oklch(0.64 0.145 ${t(0)} / 0.4);
  --color-attention-subtle: oklch(0.935 0.082 ${t(10)} / 0.75);
  --color-danger-fg: oklch(0.55 0.18 24);
  --color-danger-muted: oklch(0.55 0.18 24 / 0.35);
  --color-danger-subtle: oklch(0.95 0.04 24);

  --color-primer-shadow-inset: 0 0 #0000;
  --color-social-reaction-bg-hover: oklch(0.915 0.088 ${p(-7)} / 0.7);
  --color-social-reaction-bg-reacted-hover: oklch(0.935 0.082 ${t(10)} / 0.85);
}

main .pagination-loader-container {
  background-image: url(https://github.com/images/modules/pulls/progressive-disclosure-line.svg);
}

main .gsc-loading-image {
  background-image: url(https://github.githubassets.com/images/mona-loading-default.gif);
}

/* =========================
   M3 Expressive Overrides
   ========================= */

main,
.gsc-header,
.gsc-comment-content,
.gsc-comment-box-tabs,
.gsc-reply-box {
  transition:
    background-color 240ms ease,
    color 200ms ease,
    border-color 200ms ease;
}

.gsc-main {
  gap: 1.25rem;
}

.gsc-comment-box,
.gsc-comment > div {
  border-radius: 1.25rem !important;
  border-color: var(--color-border-default) !important;
  background-color: var(--color-canvas-overlay) !important;
  box-shadow: 0 1px 2px oklch(0.22 0.032 ${p(1)} / 0.04);
  overflow: hidden;
  transition:
    background-color 240ms ease,
    color 200ms ease,
    border-color 200ms ease,
    box-shadow 220ms ease;
}

.gsc-comment-box:focus-within {
  border-color: var(--color-accent-emphasis) !important;
  box-shadow: 0 0 0 3px oklch(0.54 0.165 ${p(0)} / 0.14);
}

.gsc-comment-box-tabs {
  background-color: var(--color-canvas-inset) !important;
  border-bottom-color: var(--color-border-muted) !important;
}

.gsc-comment-box-textarea {
  border-radius: 0.875rem !important;
  background-color: var(--color-canvas-inset) !important;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.gsc-comment-box-textarea:focus {
  background-color: var(--color-canvas-overlay) !important;
  border-color: var(--color-accent-emphasis) !important;
  box-shadow: none !important;
}

.btn,
.gsc-direct-reaction-button,
.gsc-social-reaction-summary-item {
  border-radius: 20px !important;
  transition:
    border-radius 320ms var(--ease-spring),
    transform 260ms var(--ease-spring),
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease !important;
}

.btn:hover,
.gsc-direct-reaction-button:hover,
.gsc-social-reaction-summary-item:hover {
  border-radius: 11px !important;
}

.btn:active,
.gsc-direct-reaction-button:active,
.gsc-social-reaction-summary-item:active {
  border-radius: 9px !important;
  transform: scale(0.96);
}

.gsc-comment-author-avatar img {
  border-radius: 38% !important;
  border: 1.5px solid oklch(0.54 0.165 ${p(0)} / 0.35);
  transition: border-radius 340ms var(--ease-spring) !important;
}

.gsc-comment-author-avatar:hover img {
  border-radius: 50% !important;
}

.gsc-reply-box {
  background-color: var(--color-canvas-inset) !important;
  border-top-color: var(--color-border-muted) !important;
}

.gsc-timeline-count {
  font-weight: 600;
}
`;
}

/**
 * Generates the dark Giscus theme CSS synchronized with the configured OKLCH hues.
 */
export function buildGiscusDarkCss(theme: ThemeConfig): string {
  const { primary, tertiary } = resolveHues(theme);
  const p = (offset: number): number => wrapHue(primary + offset);
  const t = (offset: number): number => wrapHue(tertiary + offset);

  return `/*!
 * Giscus Dark Theme — OKLCH Hue-Driven Palette + M3 Expressive
 */

main {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Syntax highlighting */
  --color-prettylights-syntax-comment: oklch(0.64 0.03 ${p(-7)});
  --color-prettylights-syntax-constant: oklch(0.82 0.14 ${p(-3)});
  --color-prettylights-syntax-entity: oklch(0.82 0.11 290);
  --color-prettylights-syntax-storage-modifier-import: oklch(0.90 0.018 ${p(-22)});
  --color-prettylights-syntax-entity-tag: oklch(0.82 0.14 ${p(3)});
  --color-prettylights-syntax-keyword: oklch(0.76 0.15 24);
  --color-prettylights-syntax-string: oklch(0.82 0.10 195);
  --color-prettylights-syntax-variable: oklch(0.84 0.13 ${t(2)});
  --color-prettylights-syntax-brackethighlighter-unmatched: oklch(0.72 0.17 24);
  --color-prettylights-syntax-invalid-illegal-text: oklch(0.96 0.012 ${p(-22)});
  --color-prettylights-syntax-invalid-illegal-bg: oklch(0.42 0.15 24);
  --color-prettylights-syntax-carriage-return-text: oklch(0.96 0.012 ${p(-22)});
  --color-prettylights-syntax-carriage-return-bg: oklch(0.48 0.16 24);
  --color-prettylights-syntax-string-regexp: oklch(0.82 0.14 ${p(3)});
  --color-prettylights-syntax-markup-list: oklch(0.84 0.135 ${t(6)});
  --color-prettylights-syntax-markup-heading: oklch(0.80 0.165 ${p(-3)});
  --color-prettylights-syntax-markup-italic: oklch(0.92 0.016 ${p(-25)});
  --color-prettylights-syntax-markup-bold: oklch(0.95 0.014 ${p(-25)});
  --color-prettylights-syntax-markup-deleted-text: oklch(0.88 0.08 24);
  --color-prettylights-syntax-markup-deleted-bg: oklch(0.30 0.09 24);
  --color-prettylights-syntax-markup-inserted-text: oklch(0.90 0.10 ${p(-3)});
  --color-prettylights-syntax-markup-inserted-bg: oklch(0.28 0.07 ${p(-1)});
  --color-prettylights-syntax-markup-changed-text: oklch(0.92 0.09 ${t(6)});
  --color-prettylights-syntax-markup-changed-bg: oklch(0.32 0.07 ${t(2)});
  --color-prettylights-syntax-markup-ignored-text: oklch(0.73 0.036 ${p(-9)});
  --color-prettylights-syntax-markup-ignored-bg: oklch(0.26 0.025 ${p(-1)});
  --color-prettylights-syntax-meta-diff-range: oklch(0.82 0.11 290);
  --color-prettylights-syntax-brackethighlighter-angle: oklch(0.68 0.03 ${p(-7)});
  --color-prettylights-syntax-sublimelinter-gutter-mark: oklch(0.52 0.025 ${p(-3)});
  --color-prettylights-syntax-constant-other-reference-link: oklch(0.80 0.165 ${p(-3)});

  /* Buttons */
  --color-btn-text: oklch(0.94 0.016 ${p(-25)});
  --color-btn-bg: oklch(0.255 0.024 ${p(-1)});
  --color-btn-border: oklch(0.34 0.03 ${p(-1)});
  --color-btn-shadow: 0 0 #0000;
  --color-btn-inset-shadow: 0 0 #0000;
  --color-btn-hover-bg: oklch(0.31 0.075 ${p(-1)});
  --color-btn-hover-border: oklch(0.80 0.165 ${p(-3)} / 0.5);
  --color-btn-active-bg: oklch(0.34 0.08 ${p(-1)});
  --color-btn-active-border: oklch(0.80 0.165 ${p(-3)} / 0.65);
  --color-btn-selected-bg: oklch(0.31 0.075 ${p(-1)});

  /* Primary Button */
  --color-btn-primary-text: oklch(0.17 0.028 ${p(1)});
  --color-btn-primary-bg: oklch(0.80 0.165 ${p(-3)});
  --color-btn-primary-border: oklch(0.84 0.15 ${p(-3)} / 0.4);
  --color-btn-primary-shadow: 0 4px 12px -4px oklch(0.80 0.165 ${p(-3)} / 0.35);
  --color-btn-primary-inset-shadow: 0 0 #0000;
  --color-btn-primary-hover-bg: oklch(0.84 0.16 ${p(-4)});
  --color-btn-primary-hover-border: oklch(0.88 0.14 ${p(-4)} / 0.5);
  --color-btn-primary-selected-bg: oklch(0.76 0.16 ${p(-3)});
  --color-btn-primary-selected-shadow: 0 0 #0000;
  --color-btn-primary-disabled-text: oklch(0.17 0.028 ${p(1)} / 0.6);
  --color-btn-primary-disabled-bg: oklch(0.80 0.165 ${p(-3)} / 0.42);
  --color-btn-primary-disabled-border: oklch(0.80 0.165 ${p(-3)} / 0.2);

  /* Controls & Lists */
  --color-action-list-item-default-hover-bg: oklch(0.31 0.075 ${p(-1)} / 0.65);
  --color-segmented-control-bg: oklch(0.19 0.018 ${p(1)});
  --color-segmented-control-button-bg: oklch(0.255 0.024 ${p(-1)});
  --color-segmented-control-button-selected-border: oklch(0.80 0.165 ${p(-3)} / 0.45);

  /* Foregrounds & Surfaces */
  --color-fg-default: oklch(0.94 0.016 ${p(-25)});
  --color-fg-muted: oklch(0.73 0.036 ${p(-9)});
  --color-fg-subtle: oklch(0.58 0.03 ${p(-5)});
  --color-canvas-default: transparent;
  --color-canvas-overlay: oklch(0.22 0.022 ${p(1)});
  --color-canvas-inset: oklch(0.165 0.016 ${p(1)});
  --color-canvas-subtle: oklch(0.22 0.022 ${p(1)});

  /* Borders & Neutrals */
  --color-border-default: oklch(0.31 0.028 ${p(-1)});
  --color-border-muted: oklch(0.27 0.024 ${p(-1)});
  --color-neutral-muted: oklch(0.31 0.045 ${p(-1)} / 0.55);

  /* Semantic Accents */
  --color-accent-fg: oklch(0.80 0.165 ${p(-3)});
  --color-accent-emphasis: oklch(0.80 0.165 ${p(-3)});
  --color-accent-muted: oklch(0.80 0.165 ${p(-3)} / 0.35);
  --color-accent-subtle: oklch(0.31 0.075 ${p(-1)} / 0.65);

  --color-success-fg: oklch(0.78 0.155 140);
  --color-attention-fg: oklch(0.84 0.135 ${t(6)});
  --color-attention-muted: oklch(0.84 0.135 ${t(6)} / 0.4);
  --color-attention-subtle: oklch(0.33 0.068 ${t(2)} / 0.65);
  --color-danger-fg: oklch(0.74 0.16 24);
  --color-danger-muted: oklch(0.74 0.16 24 / 0.35);
  --color-danger-subtle: oklch(0.30 0.08 24 / 0.55);

  --color-primer-shadow-inset: 0 0 #0000;
  --color-social-reaction-bg-hover: oklch(0.31 0.075 ${p(-1)} / 0.7);
  --color-social-reaction-bg-reacted-hover: oklch(0.33 0.068 ${t(2)} / 0.85);
}

main .pagination-loader-container {
  background-image: url(https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg);
}

main .gsc-loading-image {
  background-image: url(https://github.githubassets.com/images/mona-loading-dimmed.gif);
}

/* =========================
   M3 Expressive Overrides
   ========================= */

main,
.gsc-header,
.gsc-comment-content,
.gsc-comment-box-tabs,
.gsc-reply-box {
  transition:
    background-color 240ms ease,
    color 200ms ease,
    border-color 200ms ease;
}

.gsc-main {
  gap: 1.25rem;
}

.gsc-comment-box,
.gsc-comment > div {
  border-radius: 1.25rem !important;
  border-color: var(--color-border-default) !important;
  background-color: var(--color-canvas-overlay) !important;
  overflow: hidden;
  transition:
    background-color 240ms ease,
    color 200ms ease,
    border-color 200ms ease,
    box-shadow 220ms ease;
}

.gsc-comment-box:focus-within {
  border-color: var(--color-accent-emphasis) !important;
  box-shadow: 0 0 0 3px oklch(0.80 0.165 ${p(-3)} / 0.18);
}

.gsc-comment-box-tabs {
  background-color: var(--color-canvas-inset) !important;
  border-bottom-color: var(--color-border-muted) !important;
}

.gsc-comment-box-textarea {
  border-radius: 0.875rem !important;
  background-color: var(--color-canvas-inset) !important;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.gsc-comment-box-textarea:focus {
  background-color: var(--color-canvas-overlay) !important;
  border-color: var(--color-accent-emphasis) !important;
  box-shadow: none !important;
}

.btn,
.gsc-direct-reaction-button,
.gsc-social-reaction-summary-item {
  border-radius: 20px !important;
  transition:
    border-radius 320ms var(--ease-spring),
    transform 260ms var(--ease-spring),
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease !important;
}

.btn:hover,
.gsc-direct-reaction-button:hover,
.gsc-social-reaction-summary-item:hover {
  border-radius: 11px !important;
}

.btn:active,
.gsc-direct-reaction-button:active,
.gsc-social-reaction-summary-item:active {
  border-radius: 9px !important;
  transform: scale(0.96);
}

.gsc-comment-author-avatar img {
  border-radius: 38% !important;
  border: 1.5px solid oklch(0.80 0.165 ${p(-3)} / 0.35);
  transition: border-radius 340ms var(--ease-spring) !important;
}

.gsc-comment-author-avatar:hover img {
  border-radius: 50% !important;
}

.gsc-reply-box {
  background-color: var(--color-canvas-inset) !important;
  border-top-color: var(--color-border-muted) !important;
}

.gsc-timeline-count {
  font-weight: 600;
}
`;
}
