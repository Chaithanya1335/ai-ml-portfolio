"""
Cleans up the source ID-style headshot for portfolio use:
- chroma-keys out the flat blue background + white scan border
- composites the subject onto a professional dark gradient
- sharpens / color-corrects the subject
- exports a square avatar crop
"""
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import numpy as np

SRC = r"D:\Personal projects\ai-ml-portfolio\assets\photo_original.jpg"
OUT_AVATAR = r"D:\Personal projects\ai-ml-portfolio\assets\photo.jpg"

img = Image.open(SRC).convert("RGB")
w, h = img.size
arr = np.array(img).astype(np.float32) / 255.0
R, G, B = arr[..., 0], arr[..., 1], arr[..., 2]

# Background = vivid blue (B,G >> R) or bright white scan border
is_bg_blue = ((B - R) > 0.28) & ((G - R) > 0.20)
is_border_white = (np.minimum(np.minimum(R, G), B) > 0.80)
bg_mask = (is_bg_blue | is_border_white).astype(np.uint8) * 255

mask_img = Image.fromarray(bg_mask, mode="L")
# opening (remove speckles) then closing (fill small holes), then feather
mask_img = mask_img.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
mask_img = mask_img.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=4))

bg_alpha = np.array(mask_img).astype(np.float32) / 255.0  # 1 = background
subject_alpha = 1.0 - bg_alpha

# Enhance luminance only (avoid per-channel autocontrast color cast)
ycbcr = img.convert("YCbCr")
y, cb, cr = ycbcr.split()
y = ImageOps.autocontrast(y, cutoff=1)
enhanced = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
enhanced = ImageEnhance.Color(enhanced).enhance(1.04)
enhanced = ImageEnhance.Contrast(enhanced).enhance(1.03)
enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
enh_arr = np.array(enhanced).astype(np.float32) / 255.0

# Suppress blue spill bleeding onto hair/skin edges from the old background
edge_weight = 4.0 * subject_alpha * (1.0 - subject_alpha)  # peaks at the boundary ring
blue_excess = np.clip(enh_arr[..., 2] - np.maximum(enh_arr[..., 0], enh_arr[..., 1]), 0, None)
enh_arr[..., 2] -= blue_excess * edge_weight

# Professional dark gradient background (top-left indigo -> bottom-right slate)
top_color = np.array([30, 27, 75]) / 255.0     # #1e1b4b
bot_color = np.array([15, 23, 42]) / 255.0     # #0f172a
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
t = ((xx / w) * 0.5 + (yy / h) * 0.5)[..., None]
gradient = top_color * (1 - t) + bot_color * t

alpha3 = subject_alpha[..., None]
composite = enh_arr * alpha3 + gradient * (1 - alpha3)
composite = np.clip(composite * 255.0, 0, 255).astype(np.uint8)
final_img = Image.fromarray(composite, mode="RGB")

# Determine a square crop with headroom above the hair, full width
subject_bool = subject_alpha > 0.5
rows_with_subject = np.where(subject_bool.any(axis=1))[0]
top_y = int(rows_with_subject.min()) if len(rows_with_subject) else 0
pad_top = int(0.07 * w)
crop_top = max(0, top_y - pad_top)
crop_size = w
if crop_top + crop_size > h:
    crop_top = max(0, h - crop_size)
square = final_img.crop((0, crop_top, w, crop_top + crop_size))

square_hires = square.resize((1200, 1200), Image.LANCZOS)
square_hires.save(OUT_AVATAR, quality=92, optimize=True)

print("Saved", OUT_AVATAR, square_hires.size)
