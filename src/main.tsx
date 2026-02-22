/**
 * toolboxpay - Production Master v3.1
 * Focus: Central Header Alignment & Mobile Optimisation
 * Theme: Orange & White | British English
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
      padding-top: env(safe-area-inset-top); /* Handles iPhone Notches */
    `;

    // --- CENTRED HEADER LOGIC ---
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 15px 20px; 
      background: #111; 
      border-bottom: 1px solid #333; 
      display: flex; 
      justify-content: center; /* Centres horizontally */
      align-items: center;     /* Centres vertically */
      position: relative; 
      min-height: 60px;
    `;

    // Logo Container
    const logo = document.createElement('div');
    logo.style.cssText = "display: flex; align-items: center; justify-content: center;";
    logo.innerHTML = `
      <span style="color:orange; font-weight: 800; font-size: 1.3rem; letter-spacing: -0.5px;">toolbox</span>
      <span style="color:#fff; font-weight: 400; font-size: 1.3rem; letter-spacing: -0.5px;">pay</span>
    `;

    header.appendChild(logo);
    app.appendChild(header);

    // --- MAIN CONTENT ---
    const content = document.createElement('div');
    content.style.cssText = "flex: 1; padding: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;";
    content.innerHTML = `
      <div style="background: rgba(255,165,0,0.05); border: 1px solid rgba(255,165,0,0.2); padding: 30px; border-radius: 20px;">
        <h2 style="margin: 0; color: orange; font-size: 1.2rem;">Terminal Secure</h2>
        <p style="color: #a4b0be; font-size: 0.85rem; margin-top: 10px; line-height: 1.5;">
          Header alignment updated for mobile optimisation.
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
      btn.style.cssText = "background: none; border: none; color: #fff; font-weight: bold; font-size: 0.65rem; padding: 10px 0; letter-spacing: 1px;";
      btn.innerText = label;
      nav.appendChild(btn);
    });

    app.appendChild(nav);
    root.appendChild(app);
  };

  render();
}