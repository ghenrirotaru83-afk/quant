/* ═══════════════════════════════════════════════════════════════
   QUANTUM TWEAK — Core interactions (shared on every page)
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── Custom cursor (dot + trailing ring, magnetic on interactives) ── */
  if (!isTouch) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    const hot = 'a, button, .card, .faq-q, input, .pay-method, .opt-run';
    document.addEventListener('mouseover', e => { if (e.target.closest(hot)) ring.classList.add('hot'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hot)) ring.classList.remove('hot'); });
    addEventListener('mousedown', () => ring.classList.add('hot'));
    addEventListener('mouseup', () => ring.classList.remove('hot'));
  }

  /* ── Particle constellation background ── */
  const canvas = document.getElementById('particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, parts = [];
    const COUNT = () => Math.min(90, Math.floor(innerWidth / 16));
    function resize() {
      w = canvas.width = innerWidth; h = canvas.height = innerHeight;
      parts = Array.from({ length: COUNT() }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4
      }));
    }
    resize(); addEventListener('resize', resize);
    let pmx = -999, pmy = -999;
    addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - pmx, p.y - pmy);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dm < 140 ? 'rgba(127,233,255,0.9)' : 'rgba(90,169,255,0.5)';
        ctx.fill();
      }
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79,168,255,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
        // link to cursor
        const dc = Math.hypot(parts[i].x - pmx, parts[i].y - pmy);
        if (dc < 160) {
          ctx.beginPath(); ctx.moveTo(parts[i].x, parts[i].y); ctx.lineTo(pmx, pmy);
          ctx.strokeStyle = `rgba(127,233,255,${0.25 * (1 - dc / 160)})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── Navbar scroll state + scroll progress bar ── */
  const nav = document.getElementById('nav');
  const bar = document.querySelector('.scroll-bar');
  addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 30);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }
  }, { passive: true });

  /* ── Mobile menu ── */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      const s = burger.querySelectorAll('span');
      s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
      s[1].style.opacity = open ? '0' : '1';
      s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    }));
  }

  /* ── Reveal on scroll ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });

  /* ── Count-up stats ── */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    const dur = 1700, t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const v = target * easeOut(p);
      el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); statIo.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => statIo.observe(el));

  /* ── 3D tilt + spotlight on cards ── */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Magnetic buttons ── */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.btn, .nav-cta, .opt-run').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' }); }
    });
  });

  /* ── Toast helper (global) ── */
  let toastWrap = document.querySelector('.toast-wrap');
  if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.className = 'toast-wrap'; document.body.append(toastWrap); }
  window.toast = (msg, type = 'info') => {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const ic = type === 'success'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>';
    t.innerHTML = `<span class="ti">${ic}</span><span>${msg}</span>`;
    toastWrap.append(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 3600);
  };
})();
