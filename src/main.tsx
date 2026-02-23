/**
 * toolboxpay - Production Master v6.2
 * Feature: Stripe Test Mode Detection
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const isTestMode = stripeKey.includes('_test_');

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const root = document.getElementById('root');

if (root) {
  let labourTotal = 0;
  let materialsTotal = 0;

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const grandTotal = labourTotal + materialsTotal;

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    // Header with Test Badge
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; flex-direction:column; align-items:center; gap:5px;";
    header.innerHTML = `
      <div style="display:flex; align-items:center;">
        <span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>
      </div>
      ${isTestMode ? `<span style="background:rgba(255,165,0,0.2); color:orange; font-size:0.6rem; padding:2px 8px; border-radius:10px; border:1px solid orange; font-weight:bold; letter-spacing:1px;">TEST MODE</span>` : ''}
    `;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";
    content.innerHTML = `
      <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
        <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">LABOUR (£)</label>
        <input id="lab-in" type="number" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
        
        <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">MATERIALS (£)</label>
        <input id="mat-in" type="number" value="${materialsTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
      </div>

      <div style="background:orange; padding:30px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px;">
        <div style="font-size:2.8rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
      </div>

      <button id="stripe-btn" style="width:100%; padding:20px; background:#635bff; color:#fff; border:none; border-radius:12px; font-weight:900; box-shadow:0 4px 15px rgba(99,91,255,0.3);">
        ${isTestMode ? 'SIMULATE PAYMENT' : 'PAY BY CARD'}
      </button>
    `;
    app.appendChild(content);

    root.appendChild(app);

    document.getElementById('lab-in')?.addEventListener('input', (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); });
    document.getElementById('mat-in')?.addEventListener('input', (e) => { materialsTotal = Number((e.target as HTMLInputElement).value); render(); });
  };

  render();
}