"""
Light touch-up for the new office-background headshot (no chroma key needed
this time -- background is already a clean bokeh office shot).
Crops to a square avatar with good headroom, corrects contrast/sharpness.
"""
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

SRC = r"D:\Personal projects\ai-ml-portfolio\assets\photo_original.png"
OUT_AVATAR = r"D:\Personal projects\ai-ml-portfolio\assets\photo.jpg"

img = Image.open(SRC).convert("RGB")
w, h = img.size

# Luminance-only contrast stretch (avoids color cast)
ycbcr = img.convert("YCbCr")
y, cb, cr = ycbcr.split()
y = ImageOps.autocontrast(y, cutoff=1)
enhanced = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
enhanced = ImageEnhance.Color(enhanced).enhance(1.06)
enhanced = ImageEnhance.Contrast(enhanced).enhance(1.05)
enhanced = ImageEnhance.Brightness(enhanced).enhance(1.02)
enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))

# Square crop: full width, positioned to keep headroom above hair + show shoulders
crop_top = int(0.0 * h)
crop_size = w
if crop_top + crop_size > h:
    crop_top = h - crop_size
square = enhanced.crop((0, crop_top, w, crop_top + crop_size))

square_hires = square.resize((1200, 1200), Image.LANCZOS)
square_hires.save(OUT_AVATAR, quality=92, optimize=True)
print("Saved", OUT_AVATAR, square_hires.size)
