"""
Professional headshot polish for the portfolio avatar.
- Square crop with headroom for circular display
- Mild color grade (no harsh oversharpen / oily skin)
- Soft de-shine on bright forehead/cheek hotspots
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "photo_pro.png"
# Fall back to original if pro source missing
if not SRC.exists():
    SRC = ROOT / "assets" / "photo_original.png"
OUT = ROOT / "assets" / "photo.jpg"
SIZE = 880


def de_shine(img: Image.Image) -> Image.Image:
    """Blend a soft blur only on bright specular regions."""
    blur = img.filter(ImageFilter.GaussianBlur(radius=2.2))
    gray = img.convert("L")
    mask = gray.point(lambda p: max(0, min(255, int((p - 165) * 3.2))) if p > 165 else 0)
    return Image.composite(blur, img, mask)


def square_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 2 - int(side * 0.04))
    if top + side > h:
        top = h - side
    return img.crop((left, top, left + side, top + side))


def grade(img: Image.Image) -> Image.Image:
    ycbcr = img.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    y = ImageOps.autocontrast(y, cutoff=0.5)
    out = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
    out = de_shine(out)
    out = ImageEnhance.Color(out).enhance(0.96)
    out = ImageEnhance.Contrast(out).enhance(1.04)
    out = ImageEnhance.Brightness(out).enhance(1.01)
    # Light sharpen only — heavy unsharp causes oily skin look
    out = out.filter(ImageFilter.UnsharpMask(radius=1.0, percent=55, threshold=4))
    return out


def main() -> None:
    img = Image.open(SRC).convert("RGB")
    out = grade(square_crop(img)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    out.save(OUT, quality=92, optimize=True, progressive=True)
    print(f"Saved {OUT} ({out.size[0]}x{out.size[1]})")


if __name__ == "__main__":
    main()
