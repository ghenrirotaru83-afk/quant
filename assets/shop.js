/* ═══════════════════════════════════════════════════════════════
   QUANTUM TWEAK — Checkout (shop page)
   Payment method selection + simulated purchase flow.
   NOTE: front-end demo only — no real payment is processed.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const methods = document.getElementById('payMethods');
  const buyBtn = document.getElementById('buyBtn');
  if (!methods || !buyBtn) return;
  const label = buyBtn.querySelector('.label');
  let pay = 'Card';

  methods.querySelectorAll('.pay-method').forEach(m => {
    m.addEventListener('click', () => {
      methods.querySelectorAll('.pay-method').forEach(x => x.classList.remove('sel'));
      m.classList.add('sel');
      pay = m.dataset.pay;
      label.textContent = `Pay $25 with ${pay}`;
    });
  });

  function genKey() {
    const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `QT-${seg()}-${seg()}-${seg()}`;
  }

  buyBtn.addEventListener('click', () => {
    if (buyBtn.disabled) return;
    buyBtn.disabled = true;
    label.textContent = `Processing ${pay}…`;
    if (window.toast) window.toast(`Contacting ${pay} gateway…`, 'info');

    setTimeout(() => {
      const key = genKey();
      label.textContent = 'Payment confirmed ✓';
      buyBtn.style.background = 'linear-gradient(135deg,#3ddc84,#1f9d5c)';
      if (window.toast) window.toast('Payment successful — license issued!', 'success');
      openSuccess(key);
    }, 1900);
  });

  /* Success modal with the freshly generated key */
  function openSuccess(key) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:12000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(3,6,13,.78);backdrop-filter:blur(8px);opacity:0;transition:opacity .35s;';
    ov.innerHTML = `
      <div style="max-width:440px;width:100%;text-align:center;padding:44px 36px;border-radius:14px;position:relative;
                  background:linear-gradient(165deg,rgba(61,220,132,.12),var(--surface) 65%);
                  border:1px solid var(--line-bright);box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 60px rgba(61,220,132,.18);
                  transform:translateY(20px) scale(.97);transition:transform .4s var(--ease);">
        <div style="width:64px;height:64px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                    background:rgba(61,220,132,.14);border:1px solid rgba(61,220,132,.4);color:var(--green);">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-family:var(--display);font-size:2rem;font-weight:400;letter-spacing:.06em;color:#fff;margin-bottom:8px;">You're in!</h3>
        <p style="color:var(--text-dim);font-size:.95rem;margin-bottom:24px;">Your lifetime license is ready. Your key has also been sent to Discord.</p>
        <div style="font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;">Your license key</div>
        <div id="keyBox" style="font-family:var(--mono);font-size:1.25rem;letter-spacing:.12em;color:var(--cyan);
                    background:rgba(3,6,13,.7);border:1px solid var(--line);border-radius:8px;padding:14px;cursor:none;
                    margin-bottom:20px;transition:.3s;">${key}</div>
        <a class="btn btn-primary full btn-lg" href="download.html" style="margin-bottom:10px;">Go to download</a>
        <button class="btn btn-ghost full" id="closeModal">Close</button>
      </div>`;
    document.body.append(ov);
    requestAnimationFrame(() => { ov.style.opacity = '1'; ov.querySelector('div').style.transform = 'none'; });

    const close = () => { ov.style.opacity = '0'; setTimeout(() => ov.remove(), 350); };
    ov.querySelector('#closeModal').addEventListener('click', close);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    // copy key to clipboard on click
    ov.querySelector('#keyBox').addEventListener('click', () => {
      navigator.clipboard?.writeText(key).then(() => {
        const b = ov.querySelector('#keyBox');
        b.style.borderColor = 'var(--green)'; b.style.color = 'var(--green)';
        if (window.toast) window.toast('Key copied to clipboard', 'success');
      });
    });
  }
})();
