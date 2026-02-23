/**
 * toolboxpay - Production Master v6.4
 * Feature: Haptic Success Feedback & Visual Denotation
 * Theme: Orange/White UI with Green Success Denotation
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'BILLING';
  let paymentStatus: 'IDLE' | 'SUCCESS' = 'IDLE';
  let labourTotal = 0;
  let materialsTotal = 0;

  // --- HAPTIC & AUDIO FEEDBACK ---
  const triggerSuccessEffects = () => {
    // 1. Haptic "Wobble" (Vibrate 100ms, pause 50ms, vibrate 100ms)
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // 2. "Ding Dong" Audio (Synthesised)
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    playNote(523.25, audioCtx.currentTime, 0.5); // Ding (C5)
    playNote(392.00, audioCtx.currentTime + 0.3, 0.5); // Dong (G4)
  };

  if (window.location.search.includes('success=true')) {
    paymentStatus = 'SUCCESS';
    // Trigger effects only once when the success page loads
    setTimeout(triggerSuccessEffects, 500);
  }

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    if (paymentStatus === 'SUCCESS') {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:30px; text-align:center; animation: fadeIn 0.5s ease;">
          
          <div style="width:100px; height:100px; background:#fff; border: 6px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:30px; box-shadow:0 0 40px rgba(46,204,113,0.3);">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 style="color:#fff; font-size:1.8rem; margin:0; font-weight:900;">Action Successful</h1>
          <p style="color:#a4b0be; margin-top:10px; font-size:0.95rem;">Payment received and logged.</p>
          
          <button id="done-btn" style="margin-top:40px; width:100%; max-width:280px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900; letter-spacing:1px;">RETURN TO TERMINAL</button>
        </div>

        <style>
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        </style>
      `;
      root.appendChild(app);
      document.getElementById('done-btn')?.addEventListener('click', () => {
        window.history.replaceState({}, document.title, "/");
        paymentStatus = 'IDLE';
        render();
      });
      return;
    }

    // Standard Terminal View
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:center; align-items:center;";
    header.innerHTML = `<span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; display:flex; flex-direction:column; justify-content:center;";
    content.innerHTML = `
      <div style="background:orange; padding:40px; border-radius:25px; text-align:center; color:#000; margin-bottom:30px;">
        <div style="font-size:0.8rem; font-weight:800; text-transform:uppercase;">Balance Due</div>
        <div style="font-size:3.5rem; font-weight:900;">£${(labourTotal + materialsTotal).toFixed(2)}</div>
      </div>
      <button id="test-success" style="width:100%; padding:20px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900;">TEST SUCCESS ACTION</button>
    `;
    app.appendChild(content);

    const nav = document.createElement('div');
    nav.style.cssText = "display:grid; grid-template-columns:repeat(4,1fr); background:#111; border-top:2px solid orange; padding-bottom:env(safe-area-inset-bottom, 15px); padding-top:10px;";
    ['BILLING', 'QUOTE', 'TERMS', 'ADMIN'].forEach(label => {
      const btn = document.createElement('button');
      btn.style.cssText = `background:none; border:none; color:${activeTab === label ? 'orange' : '#fff'}; font-weight:bold; font-size:0.65rem; padding:12px 0;`;
      btn.innerText = label;
      nav.appendChild(btn);
    });
    app.appendChild(nav);

    root.appendChild(app);
    document.getElementById('test-success')?.addEventListener('click', () => {
      window.location.search = '?success=true';
    });
  };

  render();
}