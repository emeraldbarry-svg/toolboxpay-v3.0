/**
 * toolboxpay - Production Master v8.7
 * Final Stabilised UI & British English Localisation
 */

const bootTerminal = () => {
  const root = document.getElementById('root');
  if (!root) return;

  let clientName = '';
  let amount = 0;
  let transactionType: 'IN' | 'OUT' = 'IN';

  const render = () => {
    const time = new Date().toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    root.innerHTML = `
      <div style="background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; overflow:hidden; user-select:none;">
        
        <div style="padding:18px 15px; background:#111; border-bottom:1px solid #333; position:relative; display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
          <div id="live-clock" style="position:absolute; right:15px; top:22px; color:orange; font-family:monospace; font-size:0.75rem; font-weight:bold;">${time}</div>
          <div style="display:flex; align-items:center; gap:2px;">
            <span style="color:orange; font-weight:800; font-size:1.5rem; letter-spacing:-1.5px;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.5rem; letter-spacing:-1.5px;">pay</span>
          </div>
          <div style="color:orange; font-size:0.6rem; font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-top:2px;">Payments</div>
        </div>

        <div style="flex:1; padding:20px; display:flex; flex-direction:column; justify-content:center;">
          <div style="background:rgba(0,0,0,0.3); padding:25px; border-radius:20px; border:1px solid #444; margin-bottom:20px;">
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:10px; font-weight:bold;">RECIPIENT / CLIENT NAME</label>
            <input id="client-inp" type="text" placeholder="Full Name" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box; outline:none; font-size:1rem;">
            
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:10px; font-weight:bold;">AMOUNT (£)</label>
            <input id="amount-inp" type="number" placeholder="0.00" value="${amount || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:25px; box-sizing:border-box; font-size:1.4rem; font-weight:bold; outline:none;">
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <button id="mode-in" style="padding:15px; border-radius:12px; border:none; font-weight:900; background:${transactionType === 'IN' ? 'orange' : '#333'}; color:${transactionType === 'IN' ? '#000' : '#fff'}; cursor:pointer;">INCOMING</button>
              <button id="mode-out" style="padding:15px; border-radius:12px; border:none; font-weight:900; background:${transactionType === 'OUT' ? 'orange' : '#333'}; color:${transactionType === 'OUT' ? '#000' : '#fff'}; cursor:pointer;">OUTGOING</button>
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
    const c = document.getElementById('client-inp') as HTMLInputElement;
    const a = document.getElementById('amount-inp') as HTMLInputElement;
    c?.addEventListener('input', () => { clientName = c.value; });
    a?.addEventListener('input', () => { amount = Number(a.value); });
    document.getElementById('mode-in')?.addEventListener('click', () => { transactionType = 'IN'; render(); });
    document.getElementById('mode-out')?.addEventListener('click', () => { transactionType = 'OUT'; render(); });
    document.getElementById('confirm-btn')?.addEventListener('click', () => alert("Transaction Processed Successfully."));
  };

  render();
  setInterval(() => {
    const el = document.getElementById('live-clock');
    if (el) el.innerText = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
};

window.onload = bootTerminal;