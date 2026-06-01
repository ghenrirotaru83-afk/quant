/* ═══════════════════════════════════════════════════════════════
   QUANTUM TWEAK — Download gate (download page)
   Verifies a license key, then runs a simulated secure download.
   NOTE: front-end demo only. Real key validation must happen
   server-side — a client-side check can always be bypassed.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const input = document.getElementById('keyInput');
  const btn = document.getElementById('dlBtn');
  const msg = document.getElementById('dlMsg');
  const prog = document.getElementById('dlProgress');
  if (!input || !btn) return;
  const bar = prog.querySelector('i');
  const label = btn.querySelector('.label');

  const DEMO_KEY = 'QT-DEMO-2026-PASS';
  const FILE = 'quantum-tweak.zip';
  // Accepts the demo key, or any key matching the QT-XXXX-XXXX-XXXX format
  const valid = k => k === DEMO_KEY || /^QT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(k);

  const setMsg = (text, cls) => { msg.textContent = text; msg.className = 'dl-msg ' + cls; };

  function progressTo(to, ms) {
    const from = parseFloat(bar.style.width) || 0;
    const t0 = performance.now();
    return new Promise(res => {
      (function tick(now) {
        const p = Math.min((now - t0) / ms, 1);
        bar.style.width = (from + (to - from) * p) + '%';
        if (p < 1) requestAnimationFrame(tick); else res();
      })(t0);
    });
  }

  function triggerDownload() {
    const a = document.createElement('a');
    a.href = FILE; a.download = FILE;
    document.body.append(a); a.click(); a.remove();
  }

  let busy = false;
  async function verify() {
    if (busy) return;
    const key = input.value.trim().toUpperCase();
    if (!key) { setMsg('Please enter your access key.', 'err'); input.focus(); return; }
    if (!valid(key)) { setMsg('✕ Invalid key. Check the format: QT-XXXX-XXXX-XXXX', 'err'); return; }

    busy = true;
    btn.disabled = true;
    prog.classList.add('show');
    bar.style.width = '0%';

    setMsg('Verifying license…', 'info');
    label.textContent = 'Verifying…';
    await progressTo(18, 600);

    setMsg('✓ Key accepted — establishing secure channel…', 'ok');
    label.textContent = 'Connecting…';
    await progressTo(40, 600);

    setMsg('Downloading Quantum_Tweak.zip…', 'info');
    label.textContent = 'Downloading…';
    await progressTo(88, 1100);

    setMsg('Verifying file integrity (SHA-256)…', 'info');
    await progressTo(100, 500);

    setMsg('✓ Download complete. Enjoy Quantum Tweak!', 'ok');
    label.textContent = 'Download again';
    if (window.toast) window.toast('Download started — check your browser', 'success');
    triggerDownload();

    btn.disabled = false;
    busy = false;
  }

  btn.addEventListener('click', verify);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') verify(); });
})();
