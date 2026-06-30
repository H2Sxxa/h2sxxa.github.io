"""Rewrite git history so every image blob is recompressed in place.

This shrinks the .git database itself: each historical version of every
image (including old, pre-compression copies) is replaced by its compressed
equivalent via git-filter-repo's blob callback. No commits are dropped and
no files are removed -- only the stored bytes of image blobs change.

Self-contained on purpose: it reuses the same MAX_EDGE / JPEG_QUALITY knobs
as automate_compress.py but carries its own byte-level recompressor so it
keeps working regardless of that script's API.

DESTRUCTIVE: rewrites every commit hash. After running you must re-add the
remote and force-push, and any clone/fork must re-clone. Make a backup first:
    git bundle create ../backup.bundle --all

Usage:
    .venv/Scripts/python.exe scripts/rewrite_history.py
"""

from __future__ import annotations

import io

import git_filter_repo as fr
from PIL import Image

MAX_EDGE = 2560
JPEG_QUALITY = 85

# JPEG and PNG magic numbers -- cheap gate before handing bytes to Pillow.
_MAGIC = (b"\xff\xd8\xff", b"\x89PNG\r\n\x1a\n")

_stats = {"blobs": 0, "changed": 0, "saved": 0}


def compress_bytes(data: bytes) -> bytes:
    """Recompress raw image bytes; return the original when not worth changing."""
    try:
        with Image.open(io.BytesIO(data)) as im:
            im.load()
            fmt = im.format
            if fmt not in ("JPEG", "MPO", "PNG"):
                return data

            w, h = im.size
            scale = min(1.0, MAX_EDGE / max(w, h))
            if scale < 1.0:
                im = im.resize(
                    (round(w * scale), round(h * scale)),
                    Image.Resampling.LANCZOS,
                )

            out = io.BytesIO()
            if fmt == "PNG":
                im.save(out, format="PNG", optimize=True)
            else:
                if im.mode in ("RGBA", "LA", "P"):
                    im = im.convert("RGB")
                im.save(out, format="JPEG", quality=JPEG_QUALITY,
                        optimize=True, progressive=True)
    except Exception:  # noqa: BLE001 - not an image / unsupported: leave as-is
        return data

    new = out.getvalue()
    return new if len(new) < len(data) else data


def blob_callback(blob, _metadata):
    data = blob.data
    if not data.startswith(_MAGIC):
        return
    _stats["blobs"] += 1
    new = compress_bytes(data)
    if len(new) < len(data):
        _stats["changed"] += 1
        _stats["saved"] += len(data) - len(new)
        blob.data = new


def main() -> None:
    args = fr.FilteringOptions.parse_args(["--force"])
    fr.RepoFilter(args, blob_callback=blob_callback).run()
    mb = _stats["saved"] / 1024 / 1024
    print(
        f"\nimage blobs seen: {_stats['blobs']} | "
        f"recompressed: {_stats['changed']} | saved ~{mb:.1f}MB across history"
    )


if __name__ == "__main__":
    main()
