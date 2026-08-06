"""Extract poster frames from project demo videos."""
from pathlib import Path

base = Path(__file__).resolve().parents[1] / "assets" / "projects"
videos = [
    base / "career-pilot" / "demo.mp4",
    base / "pathora" / "demo.mp4",
]

try:
    import cv2
except ImportError:
    print("cv2 not available — skipping posters")
    raise SystemExit(0)

for video in videos:
    if not video.exists():
        print("missing", video)
        continue
    cap = cv2.VideoCapture(str(video))
    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(fps * 2))
    ok, frame = cap.read()
    if not ok:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ok, frame = cap.read()
    cap.release()
    if not ok:
        print("failed", video)
        continue
    out = video.with_name("poster.jpg")
    cv2.imwrite(str(out), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB)")
