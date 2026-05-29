/* ============================================
   CUSTOM CURSOR
   - Map pin follows mouse
   - Dotted route trail behind it
   - Tiny plane drifts after with delay
   ============================================ */

(function () {
  const root = document.documentElement;
  root.classList.add('cursor-custom');

  // === Pin ===
  const pin = document.createElement('div');
  pin.className = 'cursor-pin';
  pin.innerHTML = `
    <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 1.5 C20.6 1.5 26 6.9 26 13.5 C26 22 14 34 14 34 C14 34 2 22 2 13.5 C2 6.9 7.4 1.5 14 1.5 Z"
        fill="#2d1f15" stroke="#2d1f15" stroke-width="1.2"/>
      <circle cx="14" cy="13" r="4" fill="#f5ead2"/>
    </svg>
  `;
  document.body.appendChild(pin);

  // === Plane (follows with easing) ===
  const plane = document.createElement('div');
  plane.className = 'cursor-plane';
  plane.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12 L22 4 L18 12 L22 20 Z" fill="#2d1f15"/>
      <path d="M10 12 L16 11 L16 13 Z" fill="#f5ead2"/>
    </svg>
  `;
  document.body.appendChild(plane);

  // === Trail container ===
  const trailEls = [];
  const TRAIL_LEN = 14;
  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.opacity = '0';
    document.body.appendChild(dot);
    trailEls.push(dot);
  }
  const trailPositions = []; // {x, y, t}

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let planeX = mouseX;
  let planeY = mouseY;
  let planeAngle = 0;

  let lastTrail = 0;
  let lastScrollT = 0;
  let scrolling = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    pin.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -100%)${scrolling ? ' scale(1.15)' : ''}`;

    // record trail position
    const now = performance.now();
    if (now - lastTrail > 28) {
      trailPositions.unshift({ x: mouseX, y: mouseY, t: now });
      if (trailPositions.length > TRAIL_LEN) trailPositions.pop();
      lastTrail = now;
    }

    // hover detection
    const el = document.elementFromPoint(mouseX, mouseY);
    if (el && (el.closest('a') || el.closest('button') || el.closest('[data-hover]'))) {
      pin.classList.add('hovering');
    } else {
      pin.classList.remove('hovering');
    }
  });

  window.addEventListener('mouseleave', () => {
    pin.style.opacity = '0';
    plane.style.opacity = '0';
  });
  window.addEventListener('mouseenter', () => {
    pin.style.opacity = '1';
    plane.style.opacity = '0.55';
  });

  // === Scroll-state class on pin ===
  window.addEventListener('scroll', () => {
    if (!scrolling) {
      scrolling = true;
      pin.classList.add('scrolling');
    }
    lastScrollT = performance.now();
  }, { passive: true });

  // === Animation loop ===
  function tick() {
    // plane lazy follow
    const dx = mouseX - planeX;
    const dy = mouseY - planeY;
    planeX += dx * 0.08;
    planeY += dy * 0.08;
    const tgtAngle = Math.atan2(dy, dx);
    // smooth angle blend
    let diff = tgtAngle - planeAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    planeAngle += diff * 0.12;
    plane.style.transform = `translate(${planeX}px, ${planeY}px) translate(-50%, -50%) rotate(${planeAngle}rad)`;

    // trail render
    const now = performance.now();
    for (let i = 0; i < TRAIL_LEN; i++) {
      const dot = trailEls[i];
      const pos = trailPositions[i];
      if (!pos) {
        dot.style.opacity = '0';
        continue;
      }
      const age = (now - pos.t) / 900; // 0..1
      if (age >= 1) {
        dot.style.opacity = '0';
        continue;
      }
      const fade = (1 - age) * 0.4;
      const size = 5 - i * 0.25;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      dot.style.opacity = fade.toString();
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
    }

    // clear scrolling state after idle
    if (scrolling && now - lastScrollT > 180) {
      scrolling = false;
      pin.classList.remove('scrolling');
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Hide cursor on touch devices
  if ('ontouchstart' in window && window.matchMedia('(pointer: coarse)').matches) {
    pin.style.display = 'none';
    plane.style.display = 'none';
    trailEls.forEach(d => d.style.display = 'none');
    root.classList.remove('cursor-custom');
    document.body.style.cursor = 'auto';
  }
})();
