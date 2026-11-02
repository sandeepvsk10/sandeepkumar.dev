const frame = document.querySelector('.window');
const leftPane = document.querySelector('.pane--left');
const topPane = document.querySelector('.subpane--top');
const promotionTiles = [topPane, document.querySelector('.subpane--bottom'), leftPane];
let promotionIndex = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

function pulse(selector) {
  if (reducedMotion.matches) return;
  document.querySelectorAll(selector).forEach((image) => {
    image.classList.add('pulse');
    image.addEventListener('animationend', () => image.classList.remove('pulse'), { once: true });
  });
}

async function transition(className, element) {
  frame.classList.add(className);
  // Reading animations flushes the new styles and gives the actual transition lifetime.
  await Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => {})));
}

async function zoomAndReset() {
  const promotedTile = promotionTiles[promotionIndex];
  promotionIndex = (promotionIndex + 1) % promotionTiles.length;
  const bounds = frame.getBoundingClientRect();
  const source = promotedTile.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.className = 'zoom-pane';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="material"></div><div class="logo-position"><img src="assets/rex-logo.png" alt="" draggable="false"></div>';
  const origin = {
    left: `${source.left - bounds.left}px`, top: `${source.top - bounds.top}px`,
    width: `${source.width}px`, height: `${source.height}px`,
  };
  Object.assign(overlay.style, origin);
  frame.append(overlay);
  await overlay.querySelector('img').decode().catch(() => {});
  // The overlay replaces the chosen tile; its siblings fade through the clear center.
  const fades = promotionTiles.map((tile) => tile.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: reducedMotion.matches || tile === promotedTile ? 0 : 300,
      easing: 'ease-in-out', fill: 'forwards',
    },
  ));
  const zoom = overlay.animate([
    origin,
    { left: '0px', top: '0px', width: '100%', height: '100%' },
  ], { duration: reducedMotion.matches ? 0 : 900, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' });
  await Promise.all([zoom, ...fades].map((animation) => animation.finished.catch(() => {})));
  overlay.style.background = '#fff';

  // Reset underneath the full-size focus pane so the next cycle has no visible jump.
  frame.classList.add('is-resetting');
  frame.classList.remove('is-split', 'is-settled', 'is-horizontal', 'is-horizontal-settled');
  frame.querySelectorAll('.pulse').forEach((image) => image.classList.remove('pulse'));
  fades.forEach((animation) => animation.cancel());
  await nextFrame();
  await nextFrame();
  overlay.remove();
  frame.classList.remove('is-resetting');
}

async function start() {
  await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => {})));
  await nextFrame();
  while (true) {
    await pause(1000);
    await transition('is-split', leftPane);
    frame.classList.add('is-settled');
    pulse('.pane--left img, .subpane--top img');
    await pause(1000);
    await transition('is-horizontal', topPane);
    frame.classList.add('is-horizontal-settled');
    pulse('.subpane img');
    await pause(1000);
    await zoomAndReset();
  }
}
// Finish active movement immediately if reduced motion is enabled mid-cycle.
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) frame.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
});
start();
