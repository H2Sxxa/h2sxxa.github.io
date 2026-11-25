const CHARS_PER_MINUTE = 400;

/**
 * Estimates reading time in minutes for a markdown document body.
 */
export function estimateReadingMinutes(body: string | undefined): number {
  if (!body) {
    return 1;
  }
  const compactLength: number = body.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(compactLength / CHARS_PER_MINUTE));
}
