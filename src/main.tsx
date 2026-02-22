/**
 * toolboxpay - Production Master v3.3
 * Feature: UK Postcode Lookup & Auto-fill
 * Theme: Orange & White | British English
 */

const root = document.getElementById('root');

if (root) {
  let activeTab = 'ADMIN';
  let postcode = '';
  let addressList: string[] = [];
  let selectedAddress = '';
  let specialising = '';

  const handlePostcodeLookup = async () => {
    if (!postcode) return;
    // In a live environment, you would call your API here. 
    // For this UI demo, we simulate the results for the busy user.
    addressList = [
      "10 High Street, Wellingborough, NN8 1AB",
      "12 High Street, Wellingborough, NN8 1AB",
      "Unit 4, Industrial Estate, Wellingborough, NN8 1AB"
    ];
    render();
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Header (Mathematically Centred)
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `<div></div><div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.35rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.35rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'ADMIN') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Admin Settings</h2>
        
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">BUSINESS ADDRESS (POSTCODE LOOKUP)</label>
          <div style="display:flex; gap:10px; margin-bottom:10px;">
            <input id="pc-input" type="text" placeholder="NN8 1AB" value="${postcode}" style="flex:1; background:#111; border:1px solid #444; color:#fff; padding:12px; border-radius:8px; text-transform:uppercase;">
            <button id="find-btn" style="background:orange; color:#000; border:none; padding:0 15px; border-radius:8px; font-weight:bold; font-size:0.8rem;">FIND</button>
          </div>

          ${addressList.length > 0 ? `
            <select id="address-select" style="width:100%; background:#111; border:1px solid orange; color:#fff; padding:12px; border-radius:8px; margin-bottom:10px;">
              <option>-- Select your address --</option>
              ${addressList.map(addr => `<option value="${addr}">${addr}</option>`).join('')}
            </select>
          ` : ''}

          <textarea id="final-addr" placeholder="Full address will appear here..." style="width:100%; background:#111; border:1px solid #333; color:#a4b0be; padding:12px; border-radius:8px; height:80px; font-size:0.85rem;">${selectedAddress}</textarea>
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">SPECIALISING IN</label>
          <input type="text" placeholder="e.g. Electrical Installations" value="${specialising}" style="width:100%; background:#111; border:1px solid #444; color:#fff; padding:12px; border-radius:8px;">
        </div>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} content ready for configuration.</div>`;
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

    // Event Listeners for the Postcode Logic
    const pcInput = document.getElementById('pc-input') as HTMLInputElement;
    if (pcInput) pcInput.onchange = (e) => { postcode = (e.target as HTMLInputElement).value; };

    const findBtn = document.getElementById('find-btn');
    if (findBtn) findBtn.onclick = handlePostcodeLookup;

    const addrSelect = document.getElementById('address-select') as HTMLSelectElement;
    if (addrSelect) addrSelect.onchange = (e) => {
      selectedAddress = (e.target as HTMLSelectElement).value;
      render();
    };
  };

  render();
}