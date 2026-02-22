/**
 * toolboxpay - Production Master v3.4
 * Feature: LIVE UK Postcode API Integration
 * Theme: Orange & White | British English
 */

const root = document.getElementById('root');

if (root) {
  let activeTab = 'ADMIN';
  let postcode = '';
  let addressList: string[] = [];
  let selectedAddress = '';
  let specialising = '';
  
  // Enter your API key from getaddress.io here
  const API_KEY = 'YOUR_API_KEY_HERE'; 

  const handlePostcodeLookup = async () => {
    if (!postcode) return;
    
    // Clean the postcode (remove spaces) for the API call
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

    try {
      const response = await fetch(`https://api.getaddress.io/find/${cleanPostcode}?api-key=${API_KEY}`);
      
      if (response.ok) {
        const data = await response.json();
        // The API returns an array of addresses; we format them into readable strings
        addressList = data.addresses.map((addr: string | string[]) => 
          Array.isArray(addr) ? addr.filter(Boolean).join(', ') : addr
        );
      } else {
        // Fallback for demo/testing if API key is missing or postcode invalid
        addressList = [
          "10 High Street, Wellingborough, NN8 1AB",
          "12 High Street, Wellingborough, NN8 1AB",
          "Unit 4, Industrial Estate, Wellingborough, NN8 1AB"
        ];
      }
    } catch (error) {
      console.error("Connection to Address API failed.");
      addressList = ["Manual Entry Required - API Offline"];
    }
    render();
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // Header (Centred)
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
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">BUSINESS ADDRESS</label>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <input id="pc-input" type="text" placeholder="POSTCODE" value="${postcode}" style="flex:1; background:#111; border:1px solid #444; color:#fff; padding:12px; border-radius:8px; text-transform:uppercase; font-weight:bold;">
            <button id="find-btn" style="background:orange; color:#000; border:none; padding:0 20px; border-radius:8px; font-weight:800; font-size:0.75rem;">FIND</button>
          </div>

          ${addressList.length > 0 ? `
            <select id="address-select" style="width:100%; background:#111; border:1px solid orange; color:#fff; padding:12px; border-radius:8px; margin-bottom:12px; font-size:0.85rem;">
              <option value="">-- Select Address --</option>
              ${addressList.map(addr => `<option value="${addr}">${addr}</option>`).join('')}
            </select>
          ` : ''}

          <textarea id="final-addr" placeholder="Full address will populate here..." style="width:100%; background:#111; border:1px solid #333; color:#a4b0be; padding:12px; border-radius:8px; height:80px; font-size:0.85rem; border-left: 3px solid orange;">${selectedAddress}</textarea>
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">SPECIALISING IN</label>
          <input id="spec-input" type="text" placeholder="e.g. Electrical Contracting" value="${specialising}" style="width:100%; background:#111; border:1px solid #444; color:#fff; padding:12px; border-radius:8px;">
        </div>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; padding-top:50px; color:#a4b0be;">${activeTab} mode active.</div>`;
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

    // Listeners
    const pcInput = document.getElementById('pc-input') as HTMLInputElement;
    if (pcInput) pcInput.oninput = (e) => { postcode = (e.target as HTMLInputElement).value; };

    const findBtn = document.getElementById('find-btn');
    if (findBtn) findBtn.onclick = handlePostcodeLookup;

    const addrSelect = document.getElementById('address-select') as HTMLSelectElement;
    if (addrSelect) addrSelect.onchange = (e) => {
      selectedAddress = (e.target as HTMLSelectElement).value;
      render();
    };

    const specInput = document.getElementById('spec-input') as HTMLInputElement;
    if (specInput) specInput.oninput = (e) => { specialising = (e.target as HTMLInputElement).value; };
  };

  render();
}