/**
 * toolboxpay - Production Master v3.9
 * Feature: Business Specialisation Update
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let activeTab = 'ADMIN';
  let specialising = ''; // This maps to your new column
  let isSaving = false;

  const saveSpecialisation = async () => {
    isSaving = true;
    render();

    // This updates the 'specialising_in' column for the current profile
    const { error } = await supabase
      .from('profiles')
      .update({ specialising_in: specialising })
      .eq('id', (await supabase.auth.getUser()).data.user?.id); // Target current user

    isSaving = false;
    if (!error) alert("Specialisation updated successfully.");
    else console.error("Update failed:", error.message);
    render();
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Centred Header
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:25px; overflow-y:auto;";

    if (activeTab === 'ADMIN') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Admin Settings</h2>
        
        <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:25px;">
          <label style="font-size:0.75rem; color:#a4b0be; display:block; margin-bottom:10px; letter-spacing:0.5px;">SPECIALISING IN</label>
          <input id="spec-input" type="text" placeholder="e.g. Domestic Electrical" value="${specialising}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; font-size:1rem;">
          <p style="font-size:0.65rem; color:#636e72; margin-top:10px;">This will appear on all your generated quotes and bills.</p>
        </div>

        <button id="save-btn" style="width:100%; padding:20px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900; font-size:0.9rem; letter-spacing:1px; cursor:pointer;">
          ${isSaving ? 'UPDATING...' : 'SAVE CHANGES'}
        </button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} Content Area</div>`;
    }
    app.appendChild(content);

    // Navigation
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

    // Bindings
    const specInput = document.getElementById('spec-input') as HTMLInputElement;
    if (specInput) specInput.oninput = (e) => specialising = (e.target as HTMLInputElement).value;
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) saveBtn.onclick = saveSpecialisation;
  };

  render();
}