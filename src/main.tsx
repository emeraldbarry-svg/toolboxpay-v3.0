/**
 * toolboxpay - Production Master v3.1 (Centred)
 * Theme: Orange, White & Slate | British English
 * Logic: Fixed Header Alignment & Cross-Platform Safe Areas
 */

const root = document.getElementById('root');

if (root) {
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

    // --- CENTRED HEADER LOGIC ---
    // We use a 3-column grid to ensure the logo is mathematically centred
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 15px 20px; 
      background: #111; 
      border-bottom: 1px solid #333; 
      display: grid;
      grid-template-columns: 1fr auto 1fr; /* Middle column fits logo exactly */
      align-items: center;
      min-height: 60px;
    `;

    // Empty Left Spacer
    const leftSpacer = document.createElement('div');
    
    // Logo (Middle)
    const logo = document.createElement('div');
    logo.style.cssText = "display: flex; align-items: center; justify-content: center;";
    logo.innerHTML = `
      <span style="color:orange; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.5px;">toolbox</span>
      <span style="color:#fff; font-weight: 400; font-size: 1.35rem; letter-spacing: -0.5px;">pay</span>
    `;

    // Empty Right Spacer
    const rightSpacer = document.createElement('div');

    header.appendChild(leftSpacer);
    header.appendChild(logo);
    header.appendChild(rightSpacer);
    app.appendChild(header);

    // --- MAIN CONTENT ---
    const content = document.createElement('div');
    content.style.cssText = "flex: 1; padding: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;";
    content.innerHTML = `
      <div style="background: rgba(255,165,0,0.05); border: 1px solid rgba(255,165,0,0.2); padding: 30px; border-radius: 20px; width: 100%; max-width: 350px;">
        <h2 style="margin: 0; color: orange; font-size: 1.1rem;">Terminal Ready</h2>
        <p style="color: #a4b0be; font-size: 0.8rem; margin-top: 10px; line-height: 1.5;">
          Optimisation complete. The header is now mathematically centred for all mobile devices.
        </p>
      </div>
    `;
    app.appendChild(content);

    // --- NAVIGATION ---
    const nav = document.createElement('div');
    nav.style.cssText = `
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      background: #111; 
      border-top: 2px solid orange; 
      padding-bottom: env(safe-area-inset-bottom, 15px);
      padding-top: 10px;
    `;

    ['BILLING', 'QUOTE', 'TERMS', 'ADMIN'].forEach(label => {
      const btn = document.createElement('button');
      btn.style.cssText = "background: none; border: none; color: #fff; font-weight: bold; font-size: 0.65rem; padding: 12px 0; letter-spacing: 0.5px;";
      btn.innerText = label;
      nav.appendChild(btn);
    });

    app.appendChild(nav);
    root.appendChild(app);
  };

  render();
}