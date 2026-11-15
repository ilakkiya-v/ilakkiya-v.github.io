// cybh3rlux portfolio — small, dependency-free scripts.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Mobile navigation ---------- */
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- Dark / Pink theme ---------- */
const themeButtons = document.querySelectorAll('[data-theme-choice]');
function applyTheme(theme) {
  if (theme === 'pink') document.documentElement.dataset.theme = 'pink';
  else delete document.documentElement.dataset.theme;
  themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === (theme === 'pink' ? 'pink' : 'dark'))));
}
applyTheme(document.documentElement.dataset.theme);
themeButtons.forEach((b) => b.addEventListener('click', () => {
  applyTheme(b.dataset.themeChoice);
  try { localStorage.setItem('theme', b.dataset.themeChoice); } catch (e) { /* storage unavailable */ }
}));

/* ---------- Footer year ---------- */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* ---------- Image lightbox ---------- */
const dialog = document.getElementById('lightbox');
if (dialog) {
  const dialogImg = dialog.querySelector('img');
  const dialogCaption = dialog.querySelector('.lightbox-caption');
  let lastTrigger = null;
  document.querySelectorAll('.img-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') { window.open(btn.dataset.full, '_blank', 'noopener'); return; }
      lastTrigger = btn;
      const img = btn.querySelector('img');
      dialogImg.src = btn.dataset.full;
      dialogImg.alt = img ? img.alt : '';
      dialogCaption.textContent = btn.dataset.caption || '';
      dialog.showModal();
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
}

/* ---------- Decrypt / scramble headings ---------- */
const GLYPHS = '01<>/{}[]#$%&*+=?!ABCDEF♡✦';
function scramble(el) {
  const finalText = el.textContent;
  el.setAttribute('aria-label', finalText);
  const chars = [...finalText];
  let frame = 0;
  const total = 26;
  (function tick() {
    const revealUpTo = Math.floor((frame / total) * chars.length);
    el.textContent = chars.map((c, i) => {
      if (c === ' ' || i < revealUpTo) return c;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join('');
    frame++;
    if (frame <= total) setTimeout(tick, 38);
    else { el.textContent = finalText; el.removeAttribute('aria-label'); }
  })();
}
if (!reduceMotion) document.querySelectorAll('[data-scramble]').forEach((el) => scramble(el));

/* ---------- Code rain (purple / pink, with hearts and sparkles) ---------- */
function startRain(canvas) {
  const ctx = canvas.getContext('2d');
  const CHARS = '01アイウエオカキクケコ<>/{}#$♡✦01ABCDEF';
  const size = 15;
  let cols = 0, drops = [], w = 0, h = 0, visible = true, last = 0;
  const css = getComputedStyle(document.documentElement);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / size);
    drops = Array.from({ length: cols }, () => Math.random() * -h / size);
  }
  function draw(t) {
    requestAnimationFrame(draw);
    if (!visible || document.hidden || t - last < 55) return;
    last = t;
    const c1 = css.getPropertyValue('--rain-1').trim() || '#c39bff';
    const c2 = css.getPropertyValue('--rain-2').trim() || '#ff7ac8';
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${size - 2}px ui-monospace, Menlo, monospace`;
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * size;
      for (let k = 0; k < 9; k++) {
        const ch = CHARS[(i * 7 + k * 13 + Math.floor(drops[i])) % CHARS.length];
        ctx.globalAlpha = k === 0 ? 0.95 : 0.55 - k * 0.055;
        ctx.fillStyle = k === 0 ? c2 : c1;
        ctx.fillText(ch, i * size, y - k * size);
      }
      drops[i] += 0.35 + (i % 5) * 0.08;
      if (y - 9 * size > h && Math.random() > 0.96) drops[i] = Math.random() * -8;
    }
    ctx.globalAlpha = 1;
  }
  resize();
  window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  }
  requestAnimationFrame(draw);
}
if (!reduceMotion) document.querySelectorAll('canvas.rain').forEach(startRain);

/* ---------- Scroll reveal ---------- */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.core, .barrier, .explore-card, .card, .job, .gallery li, .cert-list li, .edu-list li, .ctf-card, .contact-links li, .about-photo, .earlier');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => {
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
    el.classList.add('reveal-on');
    io.observe(el);
  });
}

/* ---------- Cursor ring + sparkle trail (mouse only) ---------- */
if (finePointer && !reduceMotion) {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  let mx = -100, my = -100, rx = -100, ry = -100, lastSpark = 0;
  const SPARKS = ['♡', '✦', '0', '1', '✧', '♡'];

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    ring.classList.add('on');
    const now = performance.now();
    if (now - lastSpark > 70) {
      lastSpark = now;
      const s = document.createElement('span');
      s.className = 'spark';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
      s.style.left = `${mx + 6}px`;
      s.style.top = `${my + 6}px`;
      s.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
      s.style.setProperty('--dy', `${10 + Math.random() * 22}px`);
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }, { passive: true });
  document.addEventListener('mouseleave', () => ring.classList.remove('on'));
  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('hover', !!e.target.closest('a, button, summary, .img-btn, input'));
  });
  (function follow() {
    rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();
}

/* ---------- Hero terminal: types once ---------- */
(function typeTerminal() {
  const nodes = [...document.querySelectorAll('.term-body [data-type]')];
  if (reduceMotion || !nodes.length) return;
  const texts = nodes.map((n) => n.textContent);
  const lines = [...document.querySelectorAll('.term-body > span')];
  lines.forEach((l) => { l.style.visibility = 'hidden'; });
  nodes.forEach((n) => { n.textContent = ''; });
  let i = 0;
  function next() {
    if (i >= nodes.length) { lines.forEach((l) => { l.style.visibility = ''; }); return; }
    const node = nodes[i];
    node.closest('.term-body > span').style.visibility = '';
    const text = texts[i];
    if (node.tagName !== 'I') { node.textContent = text; i++; setTimeout(next, 250); return; }
    let c = 0;
    (function type() {
      node.textContent = text.slice(0, ++c);
      if (c < text.length) setTimeout(type, 55);
      else { i++; setTimeout(next, 180); }
    })();
  }
  setTimeout(next, 900);
})();

/* ---------- Capture the flag: piece 2/3 lives in the console ---------- */
console.log(
  '%c cybh3rlux %c\n\nhey hacker 👋 checking the console? i like you already.\nflag part 2/3: ch4ng3d_\n\nlast piece is in /robots.txt',
  'background:linear-gradient(90deg,#c39bff,#ff7ac8);color:#1a0b2b;font:700 20px monospace;padding:6px 12px;border-radius:6px',
  'color:#c39bff;font:13px monospace'
);

/* ---------- Capture the flag: checker (only the SHA-256 of the flag is stored) ---------- */
const FLAG_HASH = '865265136ef29a69a3e6559ac10eac6359d5a43f5cb3829487f812e7a4dc4047';
const ctfForm = document.querySelector('.ctf-form');
const ctfResult = document.querySelector('.ctf-result');
if (ctfForm && ctfResult) {
  ctfForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = ctfForm.flag.value.trim();
    ctfResult.className = 'ctf-result';
    if (!value) { ctfResult.textContent = 'Enter a flag first.'; ctfResult.classList.add('bad'); return; }
    if (!(window.crypto && crypto.subtle)) { ctfResult.textContent = 'Your browser can\'t check flags here. Try the live https site.'; return; }
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex === FLAG_HASH) {
      ctfResult.classList.add('ok');
      ctfResult.innerHTML = '🚩 Flag captured! You think like a hacker. Let\'s talk: <a href="mailto:ilakkiya.vijay002@gmail.com?subject=I%20found%20your%20flag">email me</a>.';
    } else {
      ctfResult.classList.add('bad');
      ctfResult.textContent = 'Not quite. Check the format: flag{...} with all 3 pieces in order.';
    }
  });
}
