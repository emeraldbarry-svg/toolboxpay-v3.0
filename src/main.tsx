/**
 * toolboxpay - Production Master v4.4
 * Feature: Quote Generation with Expiry Logic
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'QUOTE';
  let labourTotal = 0;
  let materialsTotal = 0;
  let quoteDescription = '';
  let isVatRegistered = false;
  
  let businessAddress = "No address found in Admin"; 
  let specialisingIn = "Specialist Trade";

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
        render();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const subTotal = labourTotal + materialsTotal;
    const vatAmount = isVatRegistered ? subTotal * 0.2 : 0;
    const grandTotal = subTotal + vatAmount;

    const app = document.createElement('div');
    app.className = "no-print";
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Header
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'QUOTE') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Create a Quote</h2>
        
        <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #444;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">SCOPE OF WORK</label>
          <textarea id="quote-desc" placeholder="Describe the job..." style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px; height:80px; margin-bottom:15px;">${quoteDescription}</textarea>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.6rem; color:#a4b0be;">LABOUR (£)</label>
              <input id="labour-input" type="number" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
            </div>
            <div>
              <label style="font-size:0.6rem; color:#a4b0be;">MATERIALS (£)</label>
              <input id="mats-input" type="number" value="${materialsTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:12px; border-radius:8px;">
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding:5px; margin-bottom:20px;">
          <span style="font-size:0.8rem; color:#a4b0be;">Quote valid for 30 days</span>
          <input id="vat-toggle" type="checkbox" ${isVatRegistered ? 'checked' : ''} style="width:22px; height:22px; accent-color:orange;">
        </div>

        <div style="background:orange; padding:25px; border-radius:18px; text-align:center; color:#000; margin-bottom:20px;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase;">Estimated Total</div>
          <div style="font-size:2.5rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
        </div>
        <button id="print-btn" style="width:100%; padding:20px; background:#fff; color:#000; border:none; border-radius:12px; font-weight:900; letter-spacing:1px;">SHARE QUOTATION</button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} section selected.</div>`;
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

    // --- PDF QUOTE TEMPLATE ---
    const printArea = document.createElement('div');
    printArea.className = "only-print";
    printArea.style.cssText = "display:none; color:#000; padding:40px; font-family:sans-serif;";
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    printArea.innerHTML = `
      <div style="display:flex; justify-content:space-between; border-bottom:5px solid orange; padding-bottom:20px; margin-bottom:30px;">
        <div>
          <h1 style="margin:0; color:orange; font-size:2rem;">toolboxpay</h1>
          <p style="margin:5px 0; font-weight:bold; text-transform:uppercase;">${specialisingIn}</p>
          <p style="margin:0; font-size:0.85rem; color:#444;">${businessAddress}</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0; color:#222;">QUOTATION</h2>
          <p style="margin:5px 0; color:#666;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
          <p style="margin:0; color:red; font-size:0.8rem; font-weight:bold;">Valid until: ${expiryDate.toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      <div style="margin-bottom:30px;">
        <h3 style="font-size:0.9rem; border-bottom:1px solid #eee; padding-bottom:5px;">Proposed Work</h3>
        <p style="white-space:pre-wrap; font-size:1rem; line-height:1.5;">${quoteDescription || 'No description provided.'}</p>
      </div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:40px;">
        <tr style="background:#f8f8f8; text-align:left; border-bottom:2px solid #eee;">
          <th style="padding:15px; font-size:0.9rem;">Breakdown</th>
          <th style="padding:15px; font-size:0.9rem; text-align:right;">Estimate (£)</th>
        </tr>
        <tr>
          <td style="padding:15px; border-bottom:1px solid #eee;">Labour Estimate</td>
          <td style="padding:15px; border-bottom:1px solid #eee; text-align:right;">${labourTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:15px; border-bottom:1px solid #eee;">Materials Estimate</td>
          <td style="padding:15px; border-bottom:1px solid #eee; text-align:right;">${materialsTotal.toFixed(2)}</td>
        </tr>
        ${isVatRegistered ? `<tr><td style="padding:15px; text-align:right; font-weight:bold; color:#666;">VAT (20%)</td><td style="padding:15px; text-align:right; font-weight:bold;">${vatAmount.toFixed(2)}</td></tr>` : ''}
        <tr style="font-size:1.6rem; font-weight:900;">
          <td style="padding:30px 15px; text-align:right; color:orange;">TOTAL QUOTE</td>
          <td style="padding:30px 15px; text-align:right; color:orange;">£${grandTotal.toFixed(2)}</td>
        </tr>
      </table>
      <p style="font-size:0.75rem; color:#666;">* Please note: This is an estimate based on current material costs. Prices may vary if the scope of work changes.</p>
    `;
    root.appendChild(printArea);

    // Listeners
    const descIn = document.getElementById('quote-desc') as HTMLTextAreaElement;
    if (descIn) descIn.oninput = (e) => { quoteDescription = (e.target as HTMLTextAreaElement).value; };
    const labIn = document.getElementById('labour-input') as HTMLInputElement;
    if (labIn) labIn.oninput = (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); };
    const matsIn = document.getElementById('mats-input') as HTMLInputElement;
    if (matsIn) matsIn.oninput = (e) => { materialsTotal = Number((e.target as HTMLInputElement).value); render(); };
    const vatTog = document.getElementById('vat-toggle') as HTMLInputElement;
    if (vatTog) vatTog.onchange = (e) => { isVatRegistered = (e.target as HTMLInputElement).checked; render(); };
    const printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.onclick = () => window.print();
  };

  loadProfileData();
  render();
}