/**
 * toolboxpay - Production Master v6.5
 * Feature: Personalised Success Denotation
 * Theme: Orange/White UI with Green Success Effects
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
  let clientName = '';
  let labourTotal = 0;
  let materialsTotal = 0;

  // --- HAPTIC & AUDIO FEEDBACK ---
  const triggerSuccessEffects = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // The Haptic Wobble
    }

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
    playNote(523.25, audioCtx.currentTime, 0.5); // Ding
    playNote(392.00, audioCtx.currentTime + 0.3, 0.5); // Dong
  };

  // URL Parser to catch the client name after Stripe redirect
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    paymentStatus = 'SUCCESS';
    clientName = params.get('client') || 'Customer';
    setTimeout(triggerSuccessEffects, 500);
  }

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    // --- SUCCESS VIEW WITH CLIENT NAME ---
    if (paymentStatus === 'SUCCESS') {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:30px; text-align:center;">
          
          <div style="width:110px; height:110px; background:#fff; border: 8px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:30px; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
            <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 style="color:#fff; font-size:1.8rem; margin:0; font-weight:900;">Payment Received</h1>
          <p style="color:orange; margin-top:10px; font-size:1.2rem; font-weight:bold;">From: ${clientName}</p>
          <p style="color:#a4b0be; margin-top:5px; font-size:0.9rem;">Funds have been secured and logged.</p>
          
          <div style="margin-top:40px; background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid #444; width:100%; max-width:300px;">
             <div style="display:flex; justify-content:space-between; color:#a4b0be; font-size:0.8rem; margin-bottom:5px;">
               <span>REFERENCE</span>
               <span>#${Math.floor(Math.random() * 9000) + 1000}</span>
             </div>
             <div style="display:flex; justify-content:space-between; font-weight:900; font-size:1.3rem;">
               <span>TOTAL</span>
               <span>£${(labourTotal + materialsTotal).toFixed(2)}</span>
             </div>
          </div>

          <button id="done-btn" style="margin-top:40px; width:100%; max-width:280px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900;">NEW TRANSACTION</button>
        </div>
      `;
      root.appendChild(app);
      document.getElementById('done-btn')?.addEventListener('click', () => {
        window.history.replaceState({}, document.title, "/");
        paymentStatus = 'IDLE';
        clientName = '';
        render();
      });
      return;
    }

    // --- BILLING INPUT VIEW ---
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:center; align-items:center;";
    header.innerHTML = `<span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; display:flex; flex-direction:column; justify-content:center;";
    content.innerHTML = `
      <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
        <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">CLIENT NAME</label>
        <input id="client-in" type="text" placeholder="e.g. Mr. Henderson" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">LABOUR (£)</label>
            <input id="lab-in" type="number" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
          </div>
          <div>
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">MATS (£)</label>
            <input id="mat-in" type="number" value="${materialsTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
          </div>
        </div>
      </div>

      <div style="background:orange; padding:30px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px;">
        <div style="font-size:3.2rem; font-weight:900;">£${(labourTotal + materialsTotal).toFixed(2)}</div>
      </div>

      <button id="test-pay" style="width:100%; padding:20px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900; letter-spacing:1px;">PROCESS PAYMENT</button>
    `;
    app.appendChild(content);

    root.appendChild(app);

    // Listeners
    document.getElementById('client-in')?.addEventListener('input', (e) => clientName = (e.target as HTMLInputElement).value);
    document.getElementById('lab-in')?.addEventListener('input', (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); });
    document.getElementById('mat-in')?.addEventListener('input', (e) => { materialsTotal = Number((e.target as HTMLInputElement).value); render(); });
    
    document.getElementById('test-pay')?.addEventListener('click', () => {
      if (!clientName) { alert("Please enter a Client Name first."); return; }
      // Simulate Stripe redirect including the client name in the URL
      window.location.search = `?success=true&client=${encodeURIComponent(clientName)}`;
    });
  };

  render();
}