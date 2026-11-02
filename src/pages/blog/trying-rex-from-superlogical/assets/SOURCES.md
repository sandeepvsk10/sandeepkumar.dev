# Artwork sources

- `classic-crt.svg`: custom terminal illustration. The embedded Apple rainbow
  logo is sourced from https://commons.wikimedia.org/wiki/File:Apple_Computer_Logo_rainbow.svg
  (logo design by Rob Janoff; Apple trademark).
- `claude-mascot.svg`: SVG artwork and eight-frame waving/confetti animation
  by Wale-Durojaye Ayotomiwa, https://ayotomcs.me/claude-mascot.
  Extracted from the creator's page on 2026-10-29. Original artwork, frame
  order, 125ms cadence, confetti offsets, and delays are preserved; GSAP
  playback is adapted to self-contained CSS with a reduced-motion fallback.
  The canvas includes extra room for confetti. Visible creator credit links
  to the original work at the end of the blog post.
- `claude-flag.svg` and `claude-props.svg`: additional animations from the same
  creator and source page. Original SVG frames and frame sequences are preserved,
  with CSS playback adapted from the creator's GSAP timelines. The flag uses the
  original repeating segment. Mascots play sequentially using per-animation durations; reduced-motion
  preferences disable both rotation and their internal animations.
