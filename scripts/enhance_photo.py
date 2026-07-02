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
enhanced = ImageEnhance.Color(enhanced).enhance(1.08)
enhanced = ImageEnhance.Contrast(enhanced).enhance(1.06)
enhanced = ImageEnhance.Brightness(enhanced).enhance(1.02)
# Two-pass sharpen: fine detail pass + a slightly wider pass for overall clarity
enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=1.4, percent=140, threshold=2))
enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=3.5, percent=60, threshold=3))

# Square crop: full width, positioned to keep headroom above hair + show shoulders
crop_top = int(0.0 * h)
crop_size = w
if crop_top + crop_size > h:
    crop_top = h - crop_size
square = enhanced.crop((0, crop_top, w, crop_top + crop_size))

# Keep native resolution (no upscale) to avoid interpolation softness
square.save(OUT_AVATAR, quality=95, optimize=True)
print("Saved", OUT_AVATAR, square.size)
