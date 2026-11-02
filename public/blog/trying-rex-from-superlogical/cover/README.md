# Rex Blog Artifact — Zoom Loop

Open `index.html` directly in a browser. This is a separate experimental clone; the original `rex-blog-artifact` is unchanged.

The animation loops automatically:

1. Hold the initial full-size container for one second.
2. Split vertically in 420ms, then reveal the new borders and pulse the logos.
3. Hold for one second, then split the right pane horizontally in 420ms.
4. Reveal the new borders and pulse the right-side logos.
5. Hold for one second, then expand the promoted pane to fill the original container in 900ms while the other tiles fade out over 300ms.
6. Restart the sequence seamlessly from the full-size pane.

Promotion rotates each cycle: top-right, bottom-right, left, then repeats. The expanding focus pane stays transparent during movement so the other tiles fade away visibly, rather than being covered. Its gradient border and centered logo remain visible. Once expansion and fading finish, the pane becomes white and the reset happens underneath it to avoid a flash. Reduced-motion settings disable movement, fading, and pulses while preserving the sequence.
