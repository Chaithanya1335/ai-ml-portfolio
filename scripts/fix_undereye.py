"""
Restore portfolio avatar from original photo.
- Identity-preserving (no generative face rewrite)
- Mild grade for polish
- Light under-eye skin-tone match only (no heavy mask / brightness patch)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "photo_original.png"
OUT = ROOT / "assets" / "photo.jpg"
OUT_PRO = ROOT / "assets" / "photo_pro.png"
SIZE = 880


def square_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = w
    top = int(h * 0.02)
    if top + side > h:
        top = h - side
    return img.crop((0, top, w, top + side))


def soft_ellipse_region(size: tuple[int, int], boxes: list[tuple], blur: float) -> Image.Image:
    """Soft feathered region for a gentle blend (not a hard retouch mask)."""
    w, h = size
    region = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(region)
    for cx, cy, rx, ry in boxes:
        if cx <= 1 and cy <= 1:
            cx, cy, rx, ry = cx * w, cy * h, rx * w, ry * h
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    return region.filter(ImageFilter.GaussianBlur(radius=blur))


def match_undereye_skin(img: Image.Image, amount: float = 0.18) -> Image.Image:
    """
    Lightly pull under-eye color toward cheek skin tone.
    amount is small (0.12–0.22) so texture and likeness stay natural.
    """
    w, h = img.size
    region = soft_ellipse_region(
        (w, h),
        boxes=[
            (0.40, 0.438, 0.090, 0.040),
            (0.60, 0.438, 0.090, 0.040),
        ],
        blur=max(20.0, w * 0.032),
    )

    px = img.load()
    samples = [
        px[int(sx * w), int(sy * h)]
        for sx, sy in [(0.36, 0.50), (0.64, 0.50), (0.50, 0.55)]
    ]
    cheek = tuple(sum(c[i] for c in samples) // len(samples) for i in range(3))

    # Color match only — no extra brightness/contrast that looks like makeup
    fill = Image.new("RGB", (w, h), cheek)
    toward_cheek = Image.blend(img, fill, 0.40)

    # Scale region alpha by amount so effect stays subtle
    alpha = region.point(lambda v: int(v * amount))
    return Image.composite(toward_cheek, img, alpha)


def mild_grade(img: Image.Image) -> Image.Image:
    ycbcr = img.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    y = ImageOps.autocontrast(y, cutoff=0.4)
    out = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
    blur = out.filter(ImageFilter.GaussianBlur(radius=1.8))
    gray = out.convert("L")
    shine = gray.point(lambda p: max(0, min(255, int((p - 175) * 2.8))) if p > 175 else 0)
    out = Image.composite(blur, out, shine)
    out = ImageEnhance.Color(out).enhance(0.98)
    out = ImageEnhance.Contrast(out).enhance(1.03)
    out = ImageEnhance.Brightness(out).enhance(1.01)
    out = out.filter(ImageFilter.UnsharpMask(radius=0.9, percent=45, threshold=4))
    return out


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    sq = square_crop(src)
    graded = mild_grade(sq)
    fixed = match_undereye_skin(graded, amount=0.18)
    out = fixed.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    out.save(OUT, quality=93, optimize=True, progressive=True)
    out.save(OUT_PRO, optimize=True)
    print(f"Saved {OUT} {out.size}")
    print("Original likeness kept — light under-eye skin-tone match only.")


if __name__ == "__main__":
    main()
