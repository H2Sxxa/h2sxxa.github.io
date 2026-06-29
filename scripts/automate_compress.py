"""Compress oversized images in the blog content tree, in place.

For each image under the target directories:
  - downscale so the longest edge is at most MAX_EDGE px
  - re-encode at QUALITY, stripping metadata
  - keep the change only when it actually saves space

JPEG/PNG stay in their original container; the goal is repo slimming, not
format conversion (Astro handles delivery-time optimization at build).

Usage:
    .venv/Scripts/python.exe scripts/automate_compress.py            # dry run
    .venv/Scripts/python.exe scripts/automate_compress.py --apply    # write changes
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

# Directories to scan, relative to the repo root.
TARGET_DIRS = ["src/content", "public"]
MAX_EDGE = 2560          # cap the longest side; plenty for full-bleed display
JPEG_QUALITY = 85
SUFFIXES = {".jpg", ".jpeg", ".png"}
# Skip files already small enough to not be worth touching.
MIN_BYTES = 200 * 1024


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{int(n)}B" if unit == "B" else f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"


def compress(path: Path, apply: bool) -> tuple[int, int]:
    """Return (old_bytes, new_bytes). new == old when nothing changed."""
    old = path.stat().st_size
    if old < MIN_BYTES:
        return old, old

    try:
        with Image.open(path) as im:
            im.load()
            fmt = im.format  # remember container before any conversion
            w, h = im.size
            scale = min(1.0, MAX_EDGE / max(w, h))
            if scale < 1.0:
                im = im.resize(
                    (round(w * scale), round(h * scale)),
                    Image.Resampling.LANCZOS,
                )

            tmp = path.with_suffix(path.suffix + ".tmp")
            if fmt == "PNG":
                im.save(tmp, format="PNG", optimize=True)
            else:
                # Flatten alpha onto white for JPEG, which has no alpha channel.
                if im.mode in ("RGBA", "LA", "P"):
                    im = im.convert("RGB")
                im.save(
                    tmp,
                    format="JPEG",
                    quality=JPEG_QUALITY,
                    optimize=True,
                    progressive=True,
                )
    except Exception as exc:  # noqa: BLE001 - report and skip bad files
        print(f"  ! skip {path}: {exc}", file=sys.stderr)
        return old, old

    new = tmp.stat().st_size
    if new >= old:
        tmp.unlink()
        return old, old

    if apply:
        tmp.replace(path)
    else:
        tmp.unlink()
    return old, new


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apply", action="store_true", help="write changes (default: dry run)")
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    files: list[Path] = []
    for d in TARGET_DIRS:
        base = root / d
        if base.exists():
            files += [
                p for p in base.rglob("*")
                if p.is_file() and p.suffix.lower() in SUFFIXES
            ]

    files.sort(key=lambda p: p.stat().st_size, reverse=True)

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"[{mode}] scanning {len(files)} images (max edge {MAX_EDGE}px, q{JPEG_QUALITY})\n")

    total_old = total_new = changed = 0
    for p in files:
        old, new = compress(p, args.apply)
        total_old += old
        total_new += new
        if new < old:
            changed += 1
            pct = (1 - new / old) * 100
            rel = p.relative_to(root).as_posix()
            print(f"  {human(old):>9} -> {human(new):>9}  (-{pct:4.1f}%)  {rel}")

    saved = total_old - total_new
    print(
        f"\n{changed} files changed | "
        f"{human(total_old)} -> {human(total_new)} | saved {human(saved)}"
    )
    if not args.apply:
        print("Dry run only. Re-run with --apply to write changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
