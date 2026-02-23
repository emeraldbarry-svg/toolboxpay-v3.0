/**
 * toolboxpay - Production Master v6.1
 * Feature: Crash-Proof Rendering & Stripe Check
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

// Secure credentials check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'BILLING';
  let labourTotal = 0;
  let materialsTotal = 0;
  let errorState = "";

  // Validate environment variables to prevent black screen
  if (!supabaseUrl || !supabaseKey) {
    errorState = "Supabase Credentials Missing in Vercel.";
  } else if (!stripeKey) {
    errorState = "Stripe Publishable Key Missing in Vercel.";
  }

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    // --- ERROR SCREEN ---
    if (errorState) {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:30px; text-align:center;">
          <div style="color:orange; font-size:3rem; margin-bottom:20px;">⚠️</div>
          <h2 style="color:#fff;">Configuration Error</h2>
          <p style="color:#a4b0be; line-height:1.5;">${errorState}</p>
          <div style="margin-top:20px; font-size:0.8rem; background:#111; padding:15px; border-radius:8px; color:orange; font-family:monospace;">
            Check Vercel Environment Variables
          </div>
        </div>
      `;
      root.appendChild(app);
      return;
    }

    // --- NORMAL APP UI ---
    const subTotal = labourTotal + materialsTotal;
    const grandTotal = subTotal * 1; // Simplified for recovery

    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:center; align-items:center;";
    header.innerHTML = `<span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";
    content.innerHTML = `
      <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Billing Terminal</h2>
      <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
        <input id="lab-in" type="number" placeholder="Labour £" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
        <input id="mat-in" type="number" placeholder="Materials £" value="${materialsTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
      </div>
      <div style="background:orange; padding:30px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px;">
        <div style="font-size:2.8rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
      </div>
      <button id="stripe-btn" style="width:100%; padding:20px; background:#635bff; color:#fff; border:none; border-radius:12px; font-weight:900;">PAY BY CARD</button>
    `;
    app.appendChild(content);

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

    document.getElementById('lab-in')?.addEventListener('input', (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); });
    document.getElementById('mat-in')?.addEventListener('input', (e) => { materialsTotal = Number((e.target as HTMLInputElement).value); render(); });
  };

  render();
}