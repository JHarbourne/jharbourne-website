#!/usr/bin/env python3
"""Crop a macOS window screenshot to the project-panel image standard.

macOS window captures (Cmd-Shift-4, Space) are RGBA with a wide transparent
margin holding the drop shadow. Flattening that to RGB turns it black, and
guessing the window edge by brightness is unreliable: the browser chrome is
near-black too. The alpha channel gives the window bounds exactly, so use it.

Output is 1600x936 (the ratio every project panel screenshot shares), cropped
rather than stretched, anchored to the top so the browser chrome is kept and
the rounded bottom corners are cut away.

    python3 scripts/crop-screenshot.py <source.png> images/<name>.jpg
"""
import sys
from PIL import Image

TARGET_W, TARGET_H = 1600, 936
RATIO = TARGET_W / TARGET_H


def window_box(im):
    """Bounds of the opaque window, from alpha where present.

    The bottom is lifted past the window's rounded corners: their transparent
    arc flattens to black notches against the page content below. The top
    corners are left alone, since they sit inside the dark browser chrome and
    never show, which is how the other project screenshots are cropped.
    """
    if "A" in im.getbands():
        solid = im.getchannel("A").point(lambda v: 255 if v > 250 else 0)
        box = solid.getbbox()
        if box:
            l, t, r, b = box
            radius = 0
            while radius < (b - t) and solid.getpixel((l, b - 1 - radius)) == 0:
                radius += 1
            return (l, t, r, b - radius)
    # already flattened: fall back to non-black content
    return im.convert("L").point(lambda v: 255 if v >= 12 else 0).getbbox()


def main(src, dst):
    im = Image.open(src)
    box = window_box(im)
    win = im.convert("RGB").crop(box)
    w, h = win.size

    # match the target ratio by cropping, never by stretching
    if round(w / RATIO) <= h:
        win = win.crop((0, 0, w, round(w / RATIO)))        # trim the bottom
    else:
        tw = round(h * RATIO)                              # trim both sides evenly
        win = win.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))

    out = win.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    out.save(dst, "JPEG", quality=88, optimize=True, progressive=True)

    def edge(pts):
        vals = [sum(out.getpixel(p)) / 3 for p in pts]
        return min(vals)

    # skip the first rows: the window's rounded top corners are dark, but they
    # sit inside the dark browser chrome and are invisible in the panel
    CHROME = 24
    left = edge([(1, y) for y in range(CHROME, TARGET_H, 20)])
    right = edge([(TARGET_W - 2, y) for y in range(CHROME, TARGET_H, 20)])
    bottom = edge([(x, TARGET_H - 2) for x in range(0, TARGET_W, 20)])
    print(f"{src}\n  window {box} -> {win.size} -> {out.size}")
    print(f"  darkest edge pixel: left {left:.0f}  right {right:.0f}  bottom {bottom:.0f}")
    if min(left, right, bottom) < 12:
        print("  WARNING: an edge is still pure black; check the crop")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
