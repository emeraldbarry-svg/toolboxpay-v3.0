/**
 * toolboxpay - Priority Terminal v8.9
 * Focus: Direct Terminal Access & British Localisation
 * Theme: Orange/White
 */

const startTerminal = () => {
  const root = document.getElementById('root');
  if (!root) return;

  let recipient = '';
  let pounds = 0;
  let flowType: 'IN' | 'OUT' = 'IN';

  const render = () => {
    const time = new Date().toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    root.innerHTML = `
      <div style="background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; overflow:hidden; user-select:none;">
        
        <div style="padding:18px 15px; background:#111; border-bottom:1px solid #333; position:relative; display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
          <div id="live-time" style="position:absolute; right:15px; top:22px; color:orange; font-family:monospace; font-size:0.75rem; font-weight:bold;">${time}</div>
          <div style="display:flex; align-items:center; gap:2px;">
            <span style="color:orange; font-weight:800; font-size:1.5rem; letter-spacing:-1.5px;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.5rem; letter-spacing:-1.5px;">pay</span>
          </div>
          <div style="color:orange; font-size:0.6rem; font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-top:2px;">Payments</div>
        </div>

        <div style="flex:1; padding:20px; display:flex; flex-direction:column; justify-content:center;">
          <div style="background:rgba(0,0,0,0.3); padding:25px; border-radius:20px; border:1px solid #444; margin-bottom:20px;">
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:10px; font-weight:bold;">RECIPIENT / CLIENT NAME</label>
            <input id="client-name" type="text" placeholder="Full Name" value="${recipient}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box; outline:none; font-size:1rem;">
            
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:10px; font-weight:bold;">AMOUNT (£)</label>
            <input id="amount-val" type="number" placeholder="0.00" value="${pounds || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:25px; box-sizing:border-box; font-size:1.4rem; font-weight:bold; outline:none;">
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <button id="set-incoming" style="padding:15px; border-radius:12px; border:none; font-weight:900; background:${flowType === 'IN' ? 'orange' : '#333'}; color:${flowType === 'IN' ? '#000' : '#fff'}; cursor:pointer;">INCOMING</button>
              <button id="set-outgoing" style="padding:15px; border-radius:12px; border:none; font-weight:900; background:${flowType === 'OUT' ? 'orange' : '#333'}; color:${flowType === 'OUT' ? '#000' : '#fff'}; cursor:pointer;">OUTGOING</button>
            </div>
          </div>
          <button id="confirm-btn" style="width:100%; padding:22px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900; font-size:1.1rem; cursor:pointer;">CONFIRM TRANSACTION</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4,1fr); background:#111; border-top:2px solid orange; padding-bottom:35px; padding-top:12px; flex-shrink:0;">
          <button style="background:none; border:none; color:orange; font-weight:bold; font-size:0.7rem; letter-spacing:1px;">BILLING</button>
          <button style="background:none; border:none; color:#fff; opacity:0.3; font-weight:bold; font-size:0.7rem; letter-spacing:1px;">QUOTE</button>
          <button style="background:none; border:none; color:#fff; opacity:0.3; font-weight:bold; font-size:0.7rem; letter-spacing:1px;">TERMS</button>
          <button style="background:none; border:none; color:#fff; opacity:0.3; font-weight:bold; font-size:0.7rem; letter-spacing:1px;">ADMIN</button>
        </div>
      </div>
    `;

    // Functional Bindings
    const c = document.getElementById('client-name') as HTMLInputElement;
    const a = document.getElementById('amount-val') as HTMLInputElement;
    
    c?.addEventListener('input', () => { recipient = c.value; });
    a?.addEventListener('input', () => { pounds = Number(a.value); });
    
    document.getElementById('set-incoming')?.addEventListener('click', () => { flowType = 'IN'; render(); });
    document.getElementById('set-outgoing')?.addEventListener('click', () => { flowType = 'OUT'; render(); });
    document.getElementById('confirm-btn')?.addEventListener('click', () => {
       alert("Terminal v8.9: Specialising British settings. Transaction ready for processing.");
    });
  };

  render();

  // Clock Ticker
  setInterval(() => {
    const el = document.getElementById('live-time');
    if (el) el.innerText = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
};

// Initialise System
if (document.readyState === 'complete') {
  startTerminal();
} else {
  window.addEventListener('load', startTerminal);
}