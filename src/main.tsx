/**
 * toolboxpay - Production Master v6.8
 * Feature: Payments Title & Logo Repair
 * Theme: Orange/White | British English | Haptic Success
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
  let amount = 0;
  let transactionType: 'IN' | 'OUT' = 'IN';

  // Load persistent audit history
  const savedHistory = localStorage.getItem('toolboxpay_audit_log');
  let history = savedHistory ? JSON.parse(savedHistory) : [];

  const triggerSuccessEffects = () => {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]); // Haptic Wobble
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

  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true' && paymentStatus === 'IDLE') {
    paymentStatus = 'SUCCESS';
    clientName = params.get('client') || 'Unknown';
    const total = Number(params.get('total')) || 0;
    const type = (params.get('type') as 'IN' | 'OUT') || 'IN';
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    history = [{ id: Date.now(), name: clientName, total, type, time: timestamp }, ...history].slice(0, 20);
    localStorage.setItem('toolboxpay_audit_log', JSON.stringify(history));
    setTimeout(triggerSuccessEffects, 500);
  }

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    // --- REPAIRED LOGO & HEADER ---
    const header = document.createElement('div');
    header.style.cssText = "padding:20px 15px; background:#111; border-bottom:1px solid #333; text-align:center;";
    header.innerHTML = `
      <div style="margin-bottom:5px; display:flex; justify-content:center; align-items:center; gap:2px;">
        <span style="color:orange; font-weight:800; font-size:1.5rem; letter-spacing:-1px;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.5rem; letter-spacing:-1px;">pay</span>
      </div>
      <div style="color:orange; font-size:0.7rem; font-weight:900; letter-spacing:3px; text-transform:uppercase;">Payments</div>
    `;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (paymentStatus === 'SUCCESS') {
      content.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <div style="width:110px; height:110px; background:#fff; border: 8px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:30px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 style="color:#fff; font-size:1.8rem; margin:0; font-weight:900;">Action Logged</h1>
          <p style="color:orange; margin-top:10px; font-size:1.2rem; font-weight:bold;">${clientName}</p>
          <button id="done-btn" style="margin-top:40px; width:100%; max-width:280px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900;">NEW ENTRY</button>
        </div>
        <style>@keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }</style>
      `;
    } else if (activeTab === 'BILLING') {
      content.innerHTML = `
        <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">RECIPIENT / CLIENT NAME</label>
          <input id="client-in" type="text" placeholder="Full Name" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box; font-size:1rem;">
          
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">AMOUNT (£)</label>
          <input id="amt-in" type="number" value="${amount || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box; font-size:1.2rem; font-weight:bold;">
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button id="set-in" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'IN' ? 'orange' : '#333'}; color:${transactionType === 'IN' ? '#000' : '#fff'}; transition:0.2s;">INCOMING</button>
            <button id="set-out" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'OUT' ? 'orange' : '#333'}; color:${transactionType === 'OUT' ? '#000' : '#fff'}; transition:0.2s;">OUTGOING</button>
          </div>
        </div>
        <button id="process-btn" style="width:100%; padding:22px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900; font-size:1rem; letter-spacing:1px; box-shadow:0 10px 20px rgba(46,204,113,0.2);">CONFIRM TRANSACTION</button>
      `;
    } else if (activeTab === 'ADMIN') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px; text-transform:uppercase;">Audit Log</h2>
        ${history.map((item: any) => `
          <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; border-left:4px solid ${item.type === 'IN' ? '#2ecc71' : '#ff4757'}; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:bold; color:#fff;">${item.name}</div>
              <div style="font-size:0.65rem; color:#a4b0be;">${item.time}</div>
            </div>
            <div style="color:${item.type === 'IN' ? '#2ecc71' : '#ff4757'}; font-weight:900;">${item.type === 'IN' ? '+' : '-'}£${item.total.toFixed(2)}</div>
          </div>
        `).join('')}
      `;
    }
    app.appendChild(content);

    // --- NAVIGATION ---
    const nav = document.createElement('div');
    nav.style.cssText = "display:grid; grid-template-columns:repeat(4,1fr); background:#111; border-top:2px solid orange; padding-bottom:env(safe-area-inset-bottom, 15px); padding-top:10px;";
    ['BILLING', 'QUOTE', 'TERMS', 'ADMIN'].forEach(label => {
      const btn = document.createElement('button');
      btn.style.cssText = `background:none; border:none; color:${activeTab === label ? 'orange' : '#fff'}; font-weight:bold; font-size:0.65rem; padding:12px 0; opacity:${activeTab === label ? '1' : '0.5'};`;
      btn.innerText = label;
      btn.onclick = () => { activeTab = label; render(); };
      nav.appendChild(btn);
    });
    app.appendChild(nav);
    root.appendChild(app);

    // Listeners
    if (paymentStatus === 'SUCCESS') {
      document.getElementById('done-btn')?.addEventListener('click', () => { window.history.replaceState({}, document.title, "/"); paymentStatus = 'IDLE'; render(); });
    } else if (activeTab === 'BILLING') {
      document.getElementById('client-in')?.addEventListener('input', (e) => clientName = (e.target as HTMLInputElement).value);
      document.getElementById('amt-in')?.addEventListener('input', (e) => amount = Number((e.target as HTMLInputElement).value));
      document.getElementById('set-in')?.addEventListener('click', () => { transactionType = 'IN'; render(); });
      document.getElementById('set-out')?.addEventListener('click', () => { transactionType = 'OUT'; render(); });
      document.getElementById('process-btn')?.addEventListener('click', () => {
        if (!clientName || !amount) return alert("Please enter both Name and Amount.");
        window.location.search = `?success=true&client=${encodeURIComponent(clientName)}&total=${amount}&type=${transactionType}`;
      });
    }
  };

  render();
}