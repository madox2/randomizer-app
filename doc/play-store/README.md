# Google Play screenshots

Phone screenshots of every screen of the app (home + 8 games), generated from the web build in
headless Chromium.

- Size: **1080 × 1920 px**, ratio **9:16** (Play Store: 16:9 or 9:16, each side 320–3840 px,
  longer side at most 2× the shorter one)
- Format: 24-bit PNG without alpha, well below the 8 MB limit per file
- Order: the file name prefix is the order in the listing (Play Store allows 2–8 phone screenshots,
  so upload the 8 you like most, e.g. skip `01_home`)

Regenerate: `npx expo export --platform web`, serve `dist/`, open it at a 360 × 640 viewport with
device scale factor 3 and capture each section (tap / drag to play it first).
