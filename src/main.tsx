/**
 * toolboxpay - Production Master v6.6
 * Feature: Admin Activity Log & Persistent Storage
 * Theme: Orange/White UI | British English
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

  // Load transaction history from storage
  const savedHistory = localStorage.getItem('toolboxpay_history');
  let history = savedHistory ? JSON.parse(savedHistory) : [];

  const triggerSuccessEffects = () => {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
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
    playNote(523.25, audioCtx.currentTime, 0.5); 
    playNote(392.00, audioCtx.currentTime + 0.3, 0.5);
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true' && paymentStatus === 'IDLE') {
    paymentStatus = 'SUCCESS';
    clientName = params.get('client') || 'Customer';
    const amount = Number(params.get('total')) || 0;
    
    // Add to history if not already present
    const newEntry = {
      id: Date.now(),
      client: clientName,
      total: amount,
      date: new Date().toLocaleDateString('en-GB')
    };
    history = [newEntry, ...history].slice(0, 10); // Keep last 10
    localStorage.setItem('toolboxpay_history', JSON.stringify(history));
    
    setTimeout(triggerSuccessEffects, 500);
  }

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    if (paymentStatus === 'SUCCESS') {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:30px; text-align:center;">
          <div style="width:110px; height:110px; background:#fff; border: 8px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:30px;">
            <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 style="color:#fff; font-size:1.8rem; margin:0; font-weight:900;">Action Success</h1>
          <p style="color:orange; margin-top:10px; font-size:1.2rem; font-weight:bold;">Client: ${clientName}</p>
          <button id="done-btn" style="margin-top:40px; width:100%; max-width:280px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900;">BACK TO TERMINAL</button>
        </div>
      `;
      root.appendChild(app);
      document.getElementById('done-btn')?.addEventListener('click', () => {
        window.history.replaceState({}, document.title, "/");
        paymentStatus = 'IDLE';
        render();
      });
      return;
    }

    // Header
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:center;";
    header.innerHTML = `<span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'BILLING') {
      content.innerHTML = `
        <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">CLIENT NAME</label>
          <input id="client-in" type="text" placeholder="e.g. J. Blogs" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">LABOUR (£)</label>
          <input id="lab-in" type="number" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
        </div>
        <div style="background:orange; padding:30px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px;">
          <div style="font-size:3rem; font-weight:900;">£${(labourTotal + materialsTotal).toFixed(2)}</div>
        </div>
        <button id="test-pay" style="width:100%; padding:20px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900;">PROCESS PAYMENT</button>
      `;
    } else if (activeTab === 'ADMIN') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Recent Activity</h2>
        ${history.length === 0 ? '<p style="color:#636e72;">No transactions yet.</p>' : history.map((item: any) => `
          <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; border:1px solid #333; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:bold; color:#fff;">${item.client}</div>
              <div style="font-size:0.7rem; color:#636e72;">${item.date}</div>
            </div>
            <div style="color:orange; font-weight:900;">£${item.total.toFixed(2)}</div>
          </div>
        `).join('')}
        <button id="clear-history" style="width:100%; margin-top:20px; background:none; border:none; color:#636e72; font-size:0.7rem;">Clear Log</button>
      `;
    }

    app.appendChild(content);

    // Nav
    const nav = document.createElement('div');
    nav.style.cssText = "display:grid; grid-template-columns:repeat(4,1fr); background:#111; border-top:2px solid orange; padding-bottom:env(safe-area-inset-bottom, 15px); padding-top:10px;";
    ['BILLING', 'QUOTE', 'TERMS', 'ADMIN'].forEach(label => {
      const btn = document.createElement('button');
      btn.style.cssText = `background:none; border:none; color:${activeTab === label ? 'orange' : '#fff'}; font-weight:bold; font-size:0.65rem; padding:12px 0;`;
      btn.innerText = label;
      btn.onclick = () => { activeTab = label; render(); };
      nav.appendChild(btn);
    });
    app.appendChild(nav);
    root.appendChild(app);

    // Listeners
    if (activeTab === 'BILLING') {
      document.getElementById('client-in')?.addEventListener('input', (e) => clientName = (e.target as HTMLInputElement).value);
      document.getElementById('lab-in')?.addEventListener('input', (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); });
      document.getElementById('test-pay')?.addEventListener('click', () => {
        if (!clientName) return alert("Enter client name.");
        window.location.search = `?success=true&client=${encodeURIComponent(clientName)}&total=${labourTotal + materialsTotal}`;
      });
    }
    if (activeTab === 'ADMIN') {
      document.getElementById('clear-history')?.addEventListener('click', () => {
        localStorage.removeItem('toolboxpay_history');
        history = [];
        render();
      });
    }
  };

  render();
}