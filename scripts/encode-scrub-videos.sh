#!/usr/bin/env bash
# Re-encodes the production scroll-scrub videos to a dense keyframe interval.
# Root cause (see video-scrub plan): source MP4s were a single GOP, so every
# scrub seek decoded from frame 0. -g/-keyint_min/-sc_threshold force a
# keyframe every 6 frames regardless of scene cuts, capping decode per seek.
set -euo pipefail

command -v ffmpeg >/dev/null 2>&1 || {
  echo "ffmpeg not found — install it first" >&2
  exit 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VIDEO_DIR="$SCRIPT_DIR/../public/assets/videos"

files=(hero.mp4 system-world.mp4 author-reveal.mp4 invitation.mp4)

for name in "${files[@]}"; do
  src="$VIDEO_DIR/$name"
  if [[ ! -f "$src" ]]; then
    echo "skip: $name not found" >&2
    continue
  fi

  tmp="$VIDEO_DIR/tmp_${name}"
  echo "encoding $name..."
  ffmpeg -y -i "$src" -c:v libx264 -crf 22 -preset slow \
    -g 12 -keyint_min 12 -sc_threshold 0 -bf 0 \
    -pix_fmt yuv420p -movflags +faststart -an "$tmp"

  # Atomic replace: if ffmpeg fails above, set -e aborts before mv and the
  # original file is untouched.
  mv "$tmp" "$src"
  echo "done: $name"
done
