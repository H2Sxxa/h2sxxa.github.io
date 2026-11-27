const NORMALIZED_BASE: string = import.meta.env.BASE_URL.replace(/\/+$/, "");

/**
 * Prefixes an internal path with Astro's configured base URL while leaving
 * external URLs, protocol links, and hash anchors untouched.
 */
export function withBase(path: string): string {
  if (!path || /^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i.test(path)) {
    return path;
  }

  const normalizedPath: string = path.startsWith("/") ? path : `/${path}`;
  if (!NORMALIZED_BASE) {
    return normalizedPath;
  }

  if (
    normalizedPath === NORMALIZED_BASE ||
    normalizedPath.startsWith(`${NORMALIZED_BASE}/`)
  ) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? `${NORMALIZED_BASE}/`
    : `${NORMALIZED_BASE}${normalizedPath}`;
}

/**
 * Strips Astro's configured base URL prefix from a pathname so route matchers
 * always compare clean root-relative paths (e.g. "/", "/blog").
 */
export function stripBase(pathname: string): string {
  if (!pathname) return "/";
  const trimmed: string = pathname.replace(/\/+$/, "") || "/";
  if (!NORMALIZED_BASE) {
    return trimmed;
  }
  if (trimmed === NORMALIZED_BASE) {
    return "/";
  }
  if (trimmed.startsWith(`${NORMALIZED_BASE}/`)) {
    return trimmed.slice(NORMALIZED_BASE.length) || "/";
  }
  return trimmed;
}
