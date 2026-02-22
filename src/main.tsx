/**
 * toolboxpay - Production Master v3.2
 * Focus: Active Navigation & Tab Logic
 * Theme: Orange & White | British English
 */

const root = document.getElementById('root');

if (root) {
  // Track which tab is currently active
  let activeTab = 'ADMIN'; 
  let showTutorial = false; // Set to false to go straight to dashboard

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = `
      background: #2F3542; 
      min-height: 100dvh; 
      display: flex; 
      flex-direction: column; 
      color: #fff; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding-top: env(safe-area-inset-top); 
    `;

    // --- CENTRED HEADER ---
    const header = document.createElement('div');
    header.style.cssText = "padding: 15px 20px; background: #111; border-bottom: 1px solid #333; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 60px;";
    header.innerHTML = `<div></div><div style="display: flex; align-items: center;"><span style="color:orange; font-weight: 800; font-size: 1.35rem;">toolbox</span><span style="color:#fff; font-weight: 400; font-size: 1.35rem;">pay</span></div><div></div>`;
    app.appendChild(header);

    // --- DYNAMIC CONTENT AREA ---
    const content = document.createElement('div');
    content.style.cssText = "flex: 1; padding: 25px; overflow-y: auto;";
    
    // Logic to change content based on the activeTab
    if (activeTab === 'ADMIN') {
      content.innerHTML = `
        <h2 style="color:orange; font-size: 1.1rem; margin-bottom: 20px;">Admin Settings</h2>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
          <label style="font-size: 0.7rem; color: #a4b0be; display: block; margin-bottom: 5px;">BUSINESS ADDRESS</label>
          <input type="text" placeholder="Enter address..." style="width: 100%; background: #111; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 5px;">
        </div>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
          <label style="font-size: 0.7rem; color: #a4b0be; display: block; margin-bottom: 5px;">SPECIALISING IN</label>
          <input type="text" placeholder="e.g. Plumbing" style="width: 100%; background: #111; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 5px;">
        </div>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; margin-top: 50px; color: #a4b0be;">${activeTab} Section coming soon...</div>`;
    }
    app.appendChild(content);

    // --- ACTIVE NAVIGATION ---
    const nav = document.createElement('div');
    nav.style.cssText = `
      display: grid; grid-template-columns: repeat(4, 1fr); 
      background: #111; border-top: 2px solid orange; 
      padding-bottom: env(safe-area-inset-bottom, 15px); padding-top: 10px;
    `;

    ['BILLING', 'QUOTE', 'TERMS', 'ADMIN'].forEach(label => {
      const btn = document.createElement('button');
      const isActive = activeTab === label;
      btn.style.cssText = `
        background: none; border: none; 
        color: ${isActive ? 'orange' : '#fff'}; 
        font-weight: bold; font-size: 0.65rem; 
        padding: 12px 0; transition: 0.3s;
      `;
      btn.innerText = label;
      
      // Make the button clickable
      btn.onclick = () => {
        activeTab = label;
        render(); // Re-draw the screen with the new active tab
      };
      
      nav.appendChild(btn);
    });

    app.appendChild(nav);
    root.appendChild(app);
  };

  render();
}