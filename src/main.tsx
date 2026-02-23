/**
 * toolboxpay - Production Master v4.3
 * Feature: Live Supabase Data Fetching for Invoices
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
  
  // Default values that get overwritten by Supabase data
  let businessAddress = "No address found in Admin"; 
  let specialisingIn = "Specialist Trade";

  // Function to pull the builder's profile from the database
  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('address, specialising_in')
        .limit(1)
        .single();
      
      if (data && !error) {
        businessAddress = data.address || businessAddress;
        specialisingIn = data.specialising_in || specialisingIn;
        render(); // Update UI with real data
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const subTotal = (labourRate * labourHours) + materialsCost;
    const vatAmount = isVatRegistered ? subTotal * 0.2 : 0;
    const grandTotal = subTotal + vatAmount;

    const app = document.createElement('div');
    app.className = "no-print";
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Header (Centred)
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'BILLING') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Billing Terminal</h2>
        <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #444;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <input id="rate-input" type="number" placeholder="Rate £/hr" value="${labourRate || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
            <input id="hours-input" type="number" placeholder="Hours" value="${labourHours || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
          </div>
          <input id="mats-input" type="number" placeholder="Materials £" value="${materialsCost || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; padding:5px; margin-bottom:20px;">
          <span style="font-size:0.8rem; color:#a4b0be;">Include 20% VAT</span>
          <input id="vat-toggle" type="checkbox" ${isVatRegistered ? 'checked' : ''} style="width:22px; height:22px; accent-color:orange;">
        </div>
        <div style="background:orange; padding:25px; border-radius:18px; text-align:center; color:#000; margin-bottom:20px;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase;">Total to Pay</div>
          <div style="font-size:2.5rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
        </div>
        <button id="print-btn" style="width:100%; padding:20px; background:#fff; color:#000; border:none; border-radius:12px; font-weight:900; letter-spacing:1px;">GENERATE PDF INVOICE</button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} mode active.</div>`;
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

    // --- PDF TEMPLATE ---
    const printArea = document.createElement('div');
    printArea.className = "only-print";
    printArea.style.cssText = "display:none; color:#000; padding:40px; font-family:sans-serif;";
    printArea.innerHTML = `
      <div style="display:flex; justify-content:space-between; border-bottom:5px solid orange; padding-bottom:20px; margin-bottom:30px;">
        <div>
          <h1 style="margin:0; color:orange; font-size:2rem;">toolboxpay</h1>
          <p style="margin:5px 0; font-weight:bold; text-transform:uppercase;">${specialisingIn}</p>
          <p style="margin:0; font-size:0.85rem; color:#444; max-width:280px; line-height:1.4;">${businessAddress}</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0; color:#222;">INVOICE</h2>
          <p style="margin:5px 0; color:#666;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:40px;">
        <tr style="background:#f8f8f8; text-align:left; border-bottom:2px solid #eee;">
          <th style="padding:15px; font-size:0.9rem;">Description</th>
          <th style="padding:15px; font-size:0.9rem; text-align:right;">Total (£)</th>
        </tr>
        <tr>
          <td style="padding:15px; border-bottom:1px solid #eee;">Labour: ${labourHours} hrs @ £${labourRate}/hr</td>
          <td style="padding:15px; border-bottom:1px solid #eee; text-align:right;">${(labourRate * labourHours).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:15px; border-bottom:1px solid #eee;">Materials</td>
          <td style="padding:15px; border-bottom:1px solid #eee; text-align:right;">${materialsCost.toFixed(2)}</td>
        </tr>
        ${isVatRegistered ? `<tr><td style="padding:15px; text-align:right; font-weight:bold; color:#666;">VAT (20%)</td><td style="padding:15px; text-align:right; font-weight:bold;">${vatAmount.toFixed(2)}</td></tr>` : ''}
        <tr style="font-size:1.6rem; font-weight:900;">
          <td style="padding:30px 15px; text-align:right; color:orange;">TOTAL DUE</td>
          <td style="padding:30px 15px; text-align:right; color:orange;">£${grandTotal.toFixed(2)}</td>
        </tr>
      </table>
    `;
    root.appendChild(printArea);

    // Event Listeners
    const rateIn = document.getElementById('rate-input') as HTMLInputElement;
    if (rateIn) rateIn.oninput = (e) => { labourRate = Number((e.target as HTMLInputElement).value); render(); };
    const hoursIn = document.getElementById('hours-input') as HTMLInputElement;
    if (hoursIn) hoursIn.oninput = (e) => { labourHours = Number((e.target as HTMLInputElement).value); render(); };
    const matsIn = document.getElementById('mats-input') as HTMLInputElement;
    if (matsIn) matsIn.oninput = (e) => { materialsCost = Number((e.target as HTMLInputElement).value); render(); };
    const vatTog = document.getElementById('vat-toggle') as HTMLInputElement;
    if (vatTog) vatTog.onchange = (e) => { isVatRegistered = (e.target as HTMLInputElement).checked; render(); };
    const printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.onclick = () => window.print();
  };

  loadProfileData(); // Kick off the Supabase fetch
  render();
}