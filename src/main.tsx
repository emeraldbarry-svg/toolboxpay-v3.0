/**
 * toolboxpay - Production Master v4.5
 * Feature: Terms of Business & PDF Integration
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'TERMS';
  let labourTotal = 0;
  let materialsTotal = 0;
  let isVatRegistered = false;
  
  // State for business details and terms
  let businessAddress = "No address found in Admin"; 
  let specialisingIn = "Specialist Trade";
  let termsOfBusiness = "1. Payment is due within 7 days of invoice date.\n2. All materials remain property of the contractor until paid in full.\n3. Work is guaranteed for 12 months.";

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('address, specialising_in, terms')
        .limit(1)
        .single();
      
      if (data && !error) {
        businessAddress = data.address || businessAddress;
        specialisingIn = data.specialising_in || specialisingIn;
        if (data.terms) termsOfBusiness = data.terms;
        render();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const saveTerms = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ terms: termsOfBusiness, updated_at: new Date() });
    
    if (!error) alert("Terms of Business updated.");
    render();
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

    if (activeTab === 'TERMS') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Terms of Business</h2>
        <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px; border:1px solid #444; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:10px;">YOUR SMALL PRINT</label>
          <textarea id="terms-input" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; height:200px; font-size:0.85rem; line-height:1.5;">${termsOfBusiness}</textarea>
          <p style="font-size:0.65rem; color:#636e72; margin-top:10px;">These terms will appear at the bottom of every PDF you generate.</p>
        </div>
        <button id="save-terms-btn" style="width:100%; padding:18px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900;">SAVE TERMS</button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} active. Total: £${grandTotal.toFixed(2)}</div>`;
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

    // --- PDF TEMPLATE (WITH TERMS INJECTED) ---
    const printArea = document.createElement('div');
    printArea.className = "only-print";
    printArea.style.cssText = "display:none; color:#000; padding:40px; font-family:sans-serif;";
    printArea.innerHTML = `
      <div style="display:flex; justify-content:space-between; border-bottom:5px solid orange; padding-bottom:20px; margin-bottom:30px;">
        <div>
          <h1 style="margin:0; color:orange; font-size:2rem;">toolboxpay</h1>
          <p style="text-transform:uppercase; font-weight:bold; margin:5px 0;">${specialisingIn}</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0;">DOCUMENT</h2>
          <p>Date: ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      
      <div style="min-height:300px;">
        <p>Document details would appear here...</p>
      </div>

      <div style="margin-top:50px; border-top:2px solid #eee; padding-top:20px;">
        <h4 style="margin-bottom:10px; font-size:0.9rem; color:orange;">Terms & Conditions</h4>
        <p style="white-space:pre-wrap; font-size:0.75rem; color:#444; line-height:1.4;">${termsOfBusiness}</p>
      </div>
    `;
    root.appendChild(printArea);

    // Bindings
    const termsIn = document.getElementById('terms-input') as HTMLTextAreaElement;
    if (termsIn) termsIn.oninput = (e) => { termsOfBusiness = (e.target as HTMLTextAreaElement).value; };
    const saveBtn = document.getElementById('save-terms-btn');
    if (saveBtn) saveBtn.onclick = saveTerms;
  };

  loadProfileData();
  render();
}