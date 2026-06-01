/* ═══════════════════════════════════════════════════════════════
   QUANTUM TWEAK — Live Optimizer widget (hero, index only)
   Simulated scan → clean → boost sequence with animated gauges.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const runBtn  = document.getElementById('optRun');
  if (!runBtn) return;
  const console_ = document.getElementById('optConsole');
  const progress = document.getElementById('optProgress');
  const CIRC = 2 * Math.PI * 42;

  const gauges = {
    cpu:  { fill: document.getElementById('gCpuFill'),  val: document.getElementById('gCpuVal') },
    ram:  { fill: document.getElementById('gRamFill'),  val: document.getElementById('gRamVal') },
    junk: { fill: document.getElementById('gJunkFill'), val: document.getElementById('gJunkVal') }
  };

  function setGauge(g, pct, color, label) {
    g.fill.style.strokeDasharray = CIRC;
    g.fill.style.strokeDashoffset = CIRC * (1 - pct / 100);
    g.fill.style.stroke = color;
    g.val.innerHTML = label;
  }

  function log(html, cls = '') {
    const ln = document.createElement('div');
    ln.className = 'ln ' + cls;
    ln.innerHTML = html;
    console_.append(ln);
    console_.scrollTop = console_.scrollHeight;
    while (console_.children.length > 7) console_.firstChild.remove();
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function animateProgress(to, ms) {
    const from = parseFloat(progress.style.width) || 0;
    const t0 = performance.now();
    return new Promise(res => {
      (function tick(now) {
        const p = Math.min((now - t0) / ms, 1);
        progress.style.width = (from + (to - from) * p) + '%';
        if (p < 1) requestAnimationFrame(tick); else res();
      })(t0);
    });
  }

  // idle baseline (a slightly stressed system)
  setGauge(gauges.cpu, 72, '#ff5d6c', '72<small>%</small>');
  setGauge(gauges.ram, 81, '#ffb454', '81<small>%</small>');
  setGauge(gauges.junk, 64, '#ffb454', '6.4<small>GB</small>');

  let busy = false;
  async function run() {
    if (busy) return;
    busy = true;
    runBtn.disabled = true;
    runBtn.classList.remove('done');
    console_.innerHTML = '';
    progress.style.width = '0%';
    runBtn.querySelector('.label').textContent = 'Scanning…';

    log('<span class="c-cyan">quantum</span><span class="c-dim">@tweak</span>:~$ optimize --deep', 'c-blue');
    await wait(500);

    // SCAN — gauges climb to "bad"
    log('<span class="c-cyan">▸</span> Scanning system processes…');
    setGauge(gauges.cpu, 88, '#ff5d6c', '88<small>%</small>');
    setGauge(gauges.ram, 91, '#ff5d6c', '91<small>%</small>');
    await animateProgress(22, 700);
    await wait(300);

    log('<span class="c-amber">!</span> 14 startup items slowing boot');
    setGauge(gauges.junk, 78, '#ff5d6c', '7.8<small>GB</small>');
    await animateProgress(40, 600);
    await wait(300);

    log('<span class="c-amber">!</span> 2,184 junk &amp; cache files found');
    await animateProgress(55, 500);
    await wait(350);

    // CLEAN — gauges fall to "good"
    runBtn.querySelector('.label').textContent = 'Optimizing…';
    log('<span class="c-green">✓</span> Purging temp + registry junk');
    setGauge(gauges.junk, 6, '#3ddc84', '0.0<small>GB</small>');
    await animateProgress(72, 700);
    await wait(300);

    log('<span class="c-green">✓</span> Trimming startup &amp; services');
    setGauge(gauges.ram, 34, '#7fe9ff', '34<small>%</small>');
    await animateProgress(86, 600);
    await wait(300);

    log('<span class="c-green">✓</span> Applying performance + FPS profile');
    setGauge(gauges.cpu, 19, '#3ddc84', '19<small>%</small>');
    await animateProgress(100, 600);
    await wait(400);

    log('<span class="c-green">●</span> Done — <b>2.31&nbsp;GB</b> freed · boot <b>-41%</b> · FPS <b>+27%</b>', 'c-green');

    runBtn.classList.add('done');
    runBtn.querySelector('.label').textContent = 'Optimized — Run Again';
    runBtn.disabled = false;
    busy = false;
    if (window.toast) window.toast('System optimized — 2.31 GB freed', 'success');
  }

  runBtn.addEventListener('click', run);

  // auto-run once when it scrolls into view
  const io = new IntersectionObserver((e) => {
    if (e[0].isIntersecting) { io.disconnect(); setTimeout(run, 600); }
  }, { threshold: 0.5 });
  io.observe(runBtn.closest('.optimizer'));
})();
