/**
 * toolboxpay - Production Master v4.1
 * Feature: PDF Invoice Generation & Sharing
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
  
  // These would ideally be fetched from your Supabase 'profiles' table
  let businessAddress = "Loading address..."; 
  let specialisingIn = "Specialist Tradesman";

  const generatePDF = () => {
    window.print(); // Triggers the system print/save as PDF dialogue
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const subTotal = (labourRate * labourHours) + materialsCost;
    const vatAmount = isVatRegistered ? subTotal * 0.2 : 0;
    const grandTotal = subTotal + vatAmount;

    const app = document.createElement('div');
    app.className = "no-print"; // Hide the app UI when printing
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // --- APP UI ---
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'BILLING') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Billing Terminal</h2>
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #444;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <input id="rate-input" type="number" placeholder="Rate £/hr" value="${labourRate || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
            <input id="hours-input" type="number" placeholder="Hours" value="${labourHours || ''}" style="background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
          </div>
          <input id="mats-input" type="number" placeholder="Materials £" value="${materialsCost || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 5px; margin-bottom:20px;">
          <span style="font-size:0.8rem; color:#a4b0be;">Include 20% VAT</span>
          <input id="vat-toggle" type="checkbox" ${isVatRegistered ? 'checked' : ''} style="width:20px; height:20px; accent-color:orange;">
        </div>
        <div style="background:orange; padding:20px; border-radius:15px; text-align:center; color:#000; margin-bottom:20px;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase;">Total to Pay</div>
          <div style="font-size:2.2rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
        </div>
        <button id="print-btn" style="width:100%; padding:18px; background:#fff; color:#000; border:none; border-radius:12px; font-weight:900; letter-spacing:1px;">SHARE INVOICE (PDF)</button>
      `;
    }
    app.appendChild(content);

    // --- NAVIGATION ---
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

    // --- HIDDEN PRINT TEMPLATE ---
    const printArea = document.createElement('div');
    printArea.className = "only-print";
    printArea.style.cssText = "display:none; color:#000; padding:40px; font-family:sans-serif;";
    printArea.innerHTML = `
      <div style="display:flex; justify-content:space-between; border-bottom:4px solid orange; padding-bottom:20px; margin-bottom:30px;">
        <div>
          <h1 style="margin:0; color:orange; font-size:2rem;">toolboxpay</h1>
          <p style="margin:5px 0; font-weight:bold;">${specialisingIn}</p>
          <p style="margin:0; font-size:0.9rem; color:#666;">${businessAddress}</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0; color:#444;">INVOICE</h2>
          <p style="margin:5px 0;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
        <tr style="background:#f4f4f4; text-align:left;">
          <th style="padding:10px; border-bottom:1px solid #ddd;">Description</th>
          <th style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">Amount</th>
        </tr>
        <tr>
          <td style="padding:10px; border-bottom:1px solid #eee;">Labour (${labourHours} hrs @ £${labourRate}/hr)</td>
          <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">£${(labourRate * labourHours).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:10px; border-bottom:1px solid #eee;">Materials</td>
          <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">£${materialsCost.toFixed(2)}</td>
        </tr>
        ${isVatRegistered ? `
        <tr>
          <td style="padding:10px; text-align:right; font-weight:bold;">VAT (20%)</td>
          <td style="padding:10px; text-align:right;">£${vatAmount.toFixed(2)}</td>
        </tr>` : ''}
        <tr style="font-size:1.4rem; font-weight:900;">
          <td style="padding:20px 10px; text-align:right; color:orange;">TOTAL</td>
          <td style="padding:20px 10px; text-align:right; color:orange;">£${grandTotal.toFixed(2)}</td>
        </tr>
      </table>
      <div style="margin-top:50px; font-size:0.8rem; color:#888; text-align:center; border-top:1px solid #eee; padding-top:20px;">
        Thank you for your business. Generated via toolboxpay.
      </div>
    `;
    root.appendChild(printArea);

    // Add Print CSS to the head
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        .no-print { display: none !important; }
        .only-print { display: block !important; }
        body { background: white !important; }
      }
    `;
    document.head.appendChild(style);

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
    if (printBtn) printBtn.onclick = generatePDF;
  };

  render();
}