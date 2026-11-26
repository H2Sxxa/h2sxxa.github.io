export type PageToken = number | "ellipsis";

const MAX_INLINE_PAGES = 7;

/**
 * Builds a fixed-width token list (at most 7 slots) so outer Prev/Next
 * controls stay aligned across page turns.
 */
export function buildPageTokens(
  currentPage: number,
  lastPage: number,
): readonly PageToken[] {
  if (lastPage <= MAX_INLINE_PAGES) {
    return Array.from({ length: lastPage }, (_, index: number) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", lastPage];
  }
  if (currentPage >= lastPage - 3) {
    return [
      1,
      "ellipsis",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage,
    ];
  }
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    lastPage,
  ];
}

/**
 * Resolves the route URL for a 1-indexed archive page under a given base path.
 */
export function resolvePageUrl(basePath: string, pageNumber: number): string {
  const normalizedBase: string = basePath.replace(/\/+$/, "");
  return pageNumber <= 1 ? normalizedBase || "/" : `${normalizedBase}/${pageNumber}`;
}
