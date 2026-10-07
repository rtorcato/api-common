#!/usr/bin/env bash
# Render the committed brand PNGs from their SVG sources.
# Sizes come from the family spec: rtorcato/repo-tooling#318.
#
# Needs librsvg: brew install librsvg
set -euo pipefail
cd "$(dirname "$0")/.."

rsvg-convert -w 1280 -h 320 brand/banner.svg        -o brand/banner.png
rsvg-convert -w 1280 -h 786 brand/banner-mobile.svg -o brand/banner-mobile.png
rsvg-convert -w 1280 -h 640 brand/social-card.svg   -o apps/docs/static/img/social-card.png
rsvg-convert -w 512  -h 512 apps/docs/static/img/favicon.svg -o apps/docs/static/img/favicon-512.png

echo "rendered: brand/banner.png brand/banner-mobile.png social-card.png favicon-512.png"
