/* ============================================
   APP, live clock, scroll reveals,
   case study modal, stamp thuds, tweaks
   ============================================ */

(function () {

  // === Hero entrance via Web Animations API ===
  // Driven in JS (not CSS animations) so static captures/exports always
  // render the final, visible state. Base CSS keeps everything visible.
  function playEntrance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.documentElement.hasAttribute('data-entered')) return;
    document.documentElement.setAttribute('data-entered', '1');

    var EASE = 'cubic-bezier(0.18, 0.7, 0.16, 1)';
    function rise(sel, delay, dur, fromY, extra) {
      var el = document.querySelector(sel);
      if (!el || !el.animate) return;
      var from = { opacity: 0, transform: 'translateY(' + (fromY || 20) + 'px)' };
      var to = { opacity: 1, transform: 'translateY(0)' };
      if (extra) { from.transform = extra.from; to.transform = extra.to; }
      if (extra && extra.filterFrom) { from.filter = extra.filterFrom; to.filter = extra.filterTo; }
      el.animate([from, to], { duration: dur || 850, delay: delay || 0, easing: EASE, fill: 'none' });
    }

    rise('.top-nav', 40, 760);
    rise('.saisha-wordmark', 160, 1000, 0, {
      from: 'translateY(28px) scale(1.035)', to: 'translateY(0) scale(1)',
      filterFrom: 'blur(7px)', filterTo: 'blur(0px)'
    });
    rise('.saisha-meta', 480, 850);
    rise('.saisha-route', 600, 850);
    rise('.hero-quote', 760, 850, 0, {
      from: 'translateY(18px) rotate(-4deg)', to: 'translateY(0) rotate(-4deg)'
    });
    rise('.hero-quote-tag', 800, 800);
    rise('.hero-footer', 680, 850);

    // stamps press in
    var stampDelays = { '.stamp-visa': 880, '.stamp-global': 1020, '.stamp-tokyo': 1160 };
    Object.keys(stampDelays).forEach(function (sel) {
      var st = document.querySelector(sel);
      var svg = st && st.querySelector('svg');
      if (!svg || !svg.animate) return;
      svg.style.transformOrigin = 'center';
      svg.animate(
        [{ opacity: 0, transform: 'scale(1.55)' }, { opacity: 1, transform: 'scale(1.55)', offset: 0.0001 },
         { opacity: 1, transform: 'scale(1)' }],
        { duration: 480, delay: stampDelays[sel], easing: 'cubic-bezier(0.2, 1.4, 0.4, 1)', fill: 'none' }
      );
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playEntrance);
  } else {
    playEntrance();
  }

  // === Live clock cycling through cities ===
  const CITIES = [
    { name: 'NEW YORK', tz: 'America/New_York', abbr: 'EST' },
    { name: 'DELHI', tz: 'Asia/Kolkata', abbr: 'IST' },
    { name: 'JAKARTA', tz: 'Asia/Jakarta', abbr: 'WIB' },
    { name: 'SHANGHAI', tz: 'Asia/Shanghai', abbr: 'CST' },
    { name: 'BANGKOK', tz: 'Asia/Bangkok', abbr: 'ICT' },
    { name: 'BOSTON', tz: 'America/New_York', abbr: 'EST' },
    { name: 'WASHINGTON', tz: 'America/New_York', abbr: 'EST' }
  ];

  let cityIdx = 0;
  function renderClock() {
    const els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    const c = CITIES[cityIdx];
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: c.tz, hour: 'numeric', minute: '2-digit', hour12: true
    });
    const timeStr = fmt.format(now).toUpperCase();
    const dateFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: c.tz, month: 'short', day: 'numeric', year: 'numeric'
    });
    const dateStr = dateFmt.format(now).toUpperCase();

    els.forEach(el => {
      const t = el.querySelector('[data-clock-time]');
      const d = el.querySelector('[data-clock-date]');
      const l = el.querySelector('[data-clock-label]');
      if (t) t.textContent = timeStr;
      if (d) d.textContent = dateStr;
      if (l) l.textContent = 'LOCAL TIME, ' + c.name;
    });
  }
  renderClock();
  setInterval(renderClock, 1000);

  // cycle city every 5s based on scroll position
  let lastSection = null;
  const sectionToCity = {
    'hero': 0, // NYC
    'about': 0,
    'experience': 0,
    'skills': 0,
    'works': 0,
    'contact': 0
  };

  // Better: cycle as user scrolls
  let cycleTimer;
  function startCycle() {
    cycleTimer = setInterval(() => {
      cityIdx = (cityIdx + 1) % CITIES.length;
      renderClock();
    }, 4200);
  }
  startCycle();

  // === Scroll reveals ===
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        // stamp thud
        if (en.target.dataset.stampSound !== undefined) {
          en.target.classList.add('thud');
        }
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => io.observe(el));

  // === Stamp thud animation (on enter) ===
  // CSS handles the visual; we just stagger
  const stampEls = document.querySelectorAll('[data-thud]');
  const stampIo = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        const delay = parseInt(en.target.dataset.thud || '0', 10);
        setTimeout(() => {
          en.target.classList.add('thudded');
        }, delay);
        stampIo.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  stampEls.forEach(el => stampIo.observe(el));

  // === Subtle scroll parallax on hero stamps ===
  const parallax = [
    { el: document.querySelector('.stamp-visa'), rate: 0.10 },
    { el: document.querySelector('.stamp-tokyo'), rate: 0.16 },
    { el: document.querySelector('.stamp-global'), rate: 0.06 }
  ].filter(p => p.el);
  let pTick = false;
  function applyParallax() {
    const y = window.pageYOffset;
    parallax.forEach(p => {
      const off = Math.max(-60, Math.min(60, y * p.rate));
      p.el.style.setProperty('--py', off.toFixed(1) + 'px');
    });
    pTick = false;
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      if (!pTick) { pTick = true; requestAnimationFrame(applyParallax); }
    }, { passive: true });
    applyParallax();
  }

  // === Case study modal ===
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  function openModal(id) {
    const data = window.CASE_STUDIES && window.CASE_STUDIES[id];
    if (!data) return;
    modalBody.innerHTML = renderCaseStudy(data);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el.dataset.modal);
    });
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function renderCaseStudy(d) {
    // Resolve asset paths to inlined blob URLs in the standalone build,
    // falling back to the raw path in the normal multi-file version.
    const R = function (p) {
      return (p && window.__resources && window.__resources[p]) || p;
    };
    // If d.sections is provided, use the rich layout. Otherwise fall back to the legacy problem/approach/outcome structure.
    const bodyContent = d.sections
      ? d.sections.map(s => {
          if (s.bullets) {
            return `
              <div class="modal-section">
                <h3>${s.heading}</h3>
                ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
                <ul class="modal-bullets">
                  ${s.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>`;
          }
          return `
            <div class="modal-section">
              <h3>${s.heading}</h3>
              ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
              <p>${s.body}</p>
            </div>`;
        }).join('')
      : `
        <div class="modal-section">
          <h3>The Problem</h3>
          <div class="kicker">${d.problemKicker}</div>
          <p>${d.problem}</p>
        </div>
        <div class="modal-section">
          <h3>Approach</h3>
          <p>${d.approach}</p>
        </div>
        <div class="modal-image"><div class="ph">PROCESS / WIREFRAMES, DROP IMAGE HERE</div></div>
        <div class="modal-section">
          <h3>Outcome</h3>
          <div class="kicker">${d.outcomeKicker}</div>
          <p>${d.outcome}</p>
        </div>
        <div class="modal-section">
          <h3>What I'd Do Differently</h3>
          <p>${d.reflection}</p>
        </div>`;

    const galleryHtml = d.gallery && d.gallery.length
      ? `<div class="modal-gallery">${d.gallery.map(g => `
          <figure class="modal-gallery-item">
            <img src="${R(g.src)}" alt="${g.label || d.title}"/>
            ${g.label ? `<figcaption>${g.label}</figcaption>` : ''}
          </figure>`).join('')}</div>`
      : '';

    const linksHtml = d.links && d.links.length
      ? `<div class="modal-links">
          <div class="modal-links-label">Read & Learn More</div>
          <div class="modal-links-row">
            ${d.links.map(l => `
              <a href="${l.href}" target="_blank" rel="noopener" class="modal-link-card" data-hover>
                <span class="modal-link-label">${l.label}</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12 L20 12 M14 6 L20 12 L14 18" stroke="currentColor" stroke-width="2"/></svg>
              </a>`).join('')}
          </div>
        </div>`
      : '';

    return `
      <button class="modal-close" id="modal-close-inner" aria-label="Close">×</button>
      <div class="modal-header">
        <div class="modal-eyebrow">${d.eyebrow || 'CASE STUDY'} · ${d.route || ''}</div>
        <h2 class="modal-title">${d.title}</h2>
        <p class="modal-sub">${d.sub}</p>
      </div>
      <dl class="modal-meta">
        <div><dt>Role</dt><dd>${d.role}</dd></div>
        <div><dt>Timeline</dt><dd>${d.timeline}</dd></div>
        <div><dt>Tools</dt><dd>${d.tools}</dd></div>
        <div><dt>Status</dt><dd>${d.status}</dd></div>
      </dl>
      <div class="modal-body">
        <div class="modal-image">${d.imgSrc ? `<img src="${R(d.imgSrc)}" alt="${d.title}"/>` : `<div class="ph">PROJECT HERO IMAGE, ${d.imgLabel || d.title.toUpperCase()}</div>`}</div>
        ${bodyContent}
        ${galleryHtml}
        ${linksHtml}
      </div>
    `;
  }

  // re-bind close on inner button (re-rendered each open)
  modal && modal.addEventListener('click', (e) => {
    if (e.target.id === 'modal-close-inner' || e.target.closest('#modal-close-inner')) {
      closeModal();
    }
  });

  // === Smooth-scroll nav links ===
  document.querySelectorAll('[data-jump]').forEach(a => {
    a.addEventListener('click', (e) => {
      const tgt = document.getElementById(a.dataset.jump);
      if (tgt) {
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === TWEAKS PANEL (vanilla) ===
  const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
    "metaphor": "moderate",
    "palette": "cream",
    "trail": true,
    "plane": true,
    "showJfk": true
  }/*EDITMODE-END*/;

  let tweaks = { ...TWEAKS_DEFAULTS };

  function applyTweaks() {
    document.body.dataset.metaphor = tweaks.metaphor;
    document.body.dataset.palette = tweaks.palette;
    document.body.dataset.trail = tweaks.trail ? '1' : '0';
    document.body.dataset.plane = tweaks.plane ? '1' : '0';
    document.body.dataset.showJfk = tweaks.showJfk ? '1' : '0';

    const root = document.documentElement;
    if (tweaks.palette === 'cream') {
      root.style.setProperty('--bg', '#f5ead2');
      root.style.setProperty('--bg-deep', '#ede0c0');
      root.style.setProperty('--bg-paper', '#f1e3c4');
      root.style.setProperty('--ink', '#2d1f15');
    } else if (tweaks.palette === 'navy') {
      root.style.setProperty('--bg', '#0f1a2d');
      root.style.setProperty('--bg-deep', '#0a1224');
      root.style.setProperty('--bg-paper', '#162542');
      root.style.setProperty('--ink', '#e8dcc0');
    } else if (tweaks.palette === 'sage') {
      root.style.setProperty('--bg', '#e7e3d4');
      root.style.setProperty('--bg-deep', '#d9d5c4');
      root.style.setProperty('--bg-paper', '#e1ddcd');
      root.style.setProperty('--ink', '#2a3326');
    }

    // trail dots
    document.querySelectorAll('.cursor-trail').forEach(d => {
      d.style.display = tweaks.trail ? '' : 'none';
    });
    // plane
    const plane = document.querySelector('.cursor-plane');
    if (plane) plane.style.display = tweaks.plane ? '' : 'none';

    // jfk stamp
    const jfk = document.querySelector('.stamp-jfk');
    if (jfk) jfk.style.display = tweaks.showJfk ? '' : 'none';
  }

  // Build panel
  const tweaksRoot = document.createElement('div');
  tweaksRoot.id = 'tweaks-panel';
  tweaksRoot.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    width: 280px;
    background: var(--bg-paper);
    border: 1px solid var(--ink);
    padding: 18px 18px 16px;
    z-index: 400;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink);
    display: none;
    box-shadow: -8px 8px 0 rgba(45,31,21,0.08);
  `;
  tweaksRoot.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px dashed rgba(45,31,21,0.18);">
      <strong style="letter-spacing:0.24em;font-size:10px;">TWEAKS</strong>
      <button id="tweaks-close" style="font-size:14px;line-height:1;background:none;border:none;cursor:none;color:inherit;">×</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(45,31,21,0.5);margin-bottom:6px;">PALETTE</div>
        <div style="display:flex;gap:6px;" data-tweak="palette">
          <button data-v="cream" style="flex:1;padding:8px;border:1px solid var(--ink);background:#f5ead2;color:#2d1f15;cursor:none;">CREAM</button>
          <button data-v="sage" style="flex:1;padding:8px;border:1px solid var(--ink);background:#e7e3d4;color:#2a3326;cursor:none;">SAGE</button>
          <button data-v="navy" style="flex:1;padding:8px;border:1px solid var(--ink);background:#0f1a2d;color:#e8dcc0;cursor:none;">NAVY</button>
        </div>
      </div>
      <div>
        <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(45,31,21,0.5);margin-bottom:6px;">METAPHOR INTENSITY</div>
        <div style="display:flex;gap:6px;" data-tweak="metaphor">
          <button data-v="light" style="flex:1;padding:8px;border:1px solid var(--ink);background:var(--bg);cursor:none;">LIGHT</button>
          <button data-v="moderate" style="flex:1;padding:8px;border:1px solid var(--ink);background:var(--bg);cursor:none;">MODERATE</button>
          <button data-v="full" style="flex:1;padding:8px;border:1px solid var(--ink);background:var(--bg);cursor:none;">FULL</button>
        </div>
      </div>
      <label style="display:flex;align-items:center;gap:10px;cursor:none;">
        <input type="checkbox" data-tweak-bool="trail" style="cursor:none;"/>
        <span style="font-size:11px;letter-spacing:0.06em;">Cursor route trail</span>
      </label>
      <label style="display:flex;align-items:center;gap:10px;cursor:none;">
        <input type="checkbox" data-tweak-bool="plane" style="cursor:none;"/>
        <span style="font-size:11px;letter-spacing:0.06em;">Plane follower</span>
      </label>
      <label style="display:flex;align-items:center;gap:10px;cursor:none;">
        <input type="checkbox" data-tweak-bool="showJfk" style="cursor:none;"/>
        <span style="font-size:11px;letter-spacing:0.06em;">JFK arrival stamp</span>
      </label>
    </div>
  `;
  document.body.appendChild(tweaksRoot);

  function syncTweakUI() {
    tweaksRoot.querySelectorAll('[data-tweak]').forEach(grp => {
      const key = grp.dataset.tweak;
      grp.querySelectorAll('button').forEach(b => {
        const active = b.dataset.v === tweaks[key];
        b.style.background = active ? 'var(--ink)' : (key === 'palette' ? b.style.background : 'var(--bg)');
        b.style.color = active ? 'var(--bg)' : (key === 'palette' ? b.style.color : 'var(--ink)');
        if (key === 'palette' && active) {
          b.style.outline = '2px solid var(--ink)';
          b.style.outlineOffset = '2px';
        } else if (key === 'palette') {
          b.style.outline = 'none';
        }
      });
    });
    tweaksRoot.querySelectorAll('[data-tweak-bool]').forEach(inp => {
      inp.checked = !!tweaks[inp.dataset.tweakBool];
    });
  }

  tweaksRoot.querySelectorAll('[data-tweak]').forEach(grp => {
    grp.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      tweaks[grp.dataset.tweak] = btn.dataset.v;
      applyTweaks();
      syncTweakUI();
      persistTweaks();
    });
  });
  tweaksRoot.querySelectorAll('[data-tweak-bool]').forEach(inp => {
    inp.addEventListener('change', () => {
      tweaks[inp.dataset.tweakBool] = inp.checked;
      applyTweaks();
      persistTweaks();
    });
  });

  function persistTweaks() {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
    } catch (e) {}
  }

  // Edit-mode protocol
  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode') {
      tweaksRoot.style.display = 'block';
    } else if (e.data.type === '__deactivate_edit_mode') {
      tweaksRoot.style.display = 'none';
    }
  });
  document.getElementById('tweaks-close').addEventListener('click', () => {
    tweaksRoot.style.display = 'none';
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e) {}
  });

  // Announce availability
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) {}

  applyTweaks();
  syncTweakUI();

})();
