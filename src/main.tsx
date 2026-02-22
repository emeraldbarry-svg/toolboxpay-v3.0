/**
 * toolboxpay - Production Master v4.0
 * Feature: Labour & Materials Billing Engine
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'BILLING';
  let labourRate = 0;
  let labourHours = 0;
  let materialsCost = 0;
  let isVatRegistered = false;

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const subTotal = (labourRate * labourHours) + materialsCost;
    const vatAmount = isVatRegistered ? subTotal * 0.2 : 0;
    const grandTotal = subTotal + vatAmount;

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Centred Header
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'BILLING') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Calculate Bill</h2>
        
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #444;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">LABOUR</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <input id="rate-input" type="number" placeholder="Rate £/hr" value="${labourRate || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
            <input id="hours-input" type="number" placeholder="Hours" value="${labourHours || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #444;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">MATERIALS TOTAL (£)</label>
          <input id="mats-input" type="number" placeholder="0.00" value="${materialsCost || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 5px;">
          <span style="font-size:0.8rem; color:#a4b0be;">Include 20% VAT</span>
          <input id="vat-toggle" type="checkbox" ${isVatRegistered ? 'checked' : ''} style="width:20px; height:20px; accent-color:orange;">
        </div>

        <div style="margin-top:25px; background:orange; padding:20px; border-radius:15px; text-align:center; color:#000;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; margin-bottom:5px;">Total to Pay</div>
          <div style="font-size:2.2rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
        </div>

        <button style="width:100%; margin-top:15px; padding:15px; background:#111; color:#fff; border:1px solid orange; border-radius:10px; font-weight:bold;">GENERATE INVOICE</button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">Section under construction.</div>`;
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

    // Event Listeners
    const rateIn = document.getElementById('rate-input') as HTMLInputElement;
    if (rateIn) rateIn.oninput = (e) => { labourRate = Number((e.target as HTMLInputElement).value); render(); };
    
    const hoursIn = document.getElementById('hours-input') as HTMLInputElement;
    if (hoursIn) hoursIn.oninput = (e) => { labourHours = Number((e.target as HTMLInputElement).value); render(); };
    
    const matsIn = document.getElementById('mats-input') as HTMLInputElement;
    if (matsIn) matsIn.oninput = (e) => { materialsCost = Number((e.target as HTMLInputElement).value); render(); };

    const vatTog = document.getElementById('vat-toggle') as HTMLInputElement;
    if (vatTog) vatTog.onchange = (e) => { isVatRegistered = (e.target as HTMLInputElement).checked; render(); };
  };

  render();
}