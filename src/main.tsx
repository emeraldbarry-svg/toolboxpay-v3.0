/**
 * toolboxpay - Production Master v6.0
 * Feature: Stripe Payment Integration
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Initialise Stripe with your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const root = document.getElementById('root');

if (root) {
  let session: any = null;
  let activeTab = 'BILLING';
  let labourTotal = 0;
  let materialsTotal = 0;
  let isVatRegistered = false;
  let isLoading = false;

  const handlePayment = async (amount: number) => {
    isLoading = true;
    render();

    try {
      // In a production environment, you would call a Supabase Edge Function 
      // or a small backend to create the Stripe Checkout Session.
      // For now, we are prepping the UI for that connection.
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialise.");

      alert(`Redirecting to secure Stripe portal for £${amount.toFixed(2)}...`);
      
      // Note: You will need a simple Edge Function to handle the 'sk_' secret key
      // and return a sessionId. I can help you write that next!
    } catch (err: any) {
      alert("Payment Error: " + err.message);
    } finally {
      isLoading = false;
      render();
    }
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const subTotal = labourTotal + materialsTotal;
    const vatAmount = isVatRegistered ? subTotal * 0.2 : 0;
    const grandTotal = subTotal + vatAmount;

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif;";

    // Header
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:center; align-items:center;";
    header.innerHTML = `<span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span>`;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto;";

    if (activeTab === 'BILLING') {
      content.innerHTML = `
        <h2 style="color:orange; font-size:1.1rem; margin-bottom:20px;">Billing Terminal</h2>
        
        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
          <div style="margin-bottom:15px;">
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">LABOUR (£)</label>
            <input id="lab-in" type="number" value="${labourTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
          </div>
          <div style="margin-bottom:5px;">
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:5px;">MATERIALS (£)</label>
            <input id="mat-in" type="number" value="${materialsTotal || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; box-sizing:border-box;">
          </div>
        </div>

        <div style="background:orange; padding:30px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px;">
          <div style="font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Amount Due</div>
          <div style="font-size:2.8rem; font-weight:900;">£${grandTotal.toFixed(2)}</div>
        </div>

        <button id="stripe-btn" style="width:100%; padding:20px; background:#635bff; color:#fff; border:none; border-radius:12px; font-weight:900; margin-bottom:15px; display:flex; align-items:center; justify-content:center; gap:10px;">
          ${isLoading ? 'LOADING...' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> PAY BY CARD'}
        </button>
        
        <button id="print-btn" style="width:100%; padding:15px; background:none; border:1px solid #555; color:#fff; border-radius:12px; font-weight:bold;">DOWNLOAD PDF</button>
      `;
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

    // Event Listeners
    document.getElementById('lab-in')?.addEventListener('input', (e) => { labourTotal = Number((e.target as HTMLInputElement).value); render(); });
    document.getElementById('mat-in')?.addEventListener('input', (e) => { materialsTotal = Number((e.target as HTMLInputElement).value); render(); });
    document.getElementById('stripe-btn')?.addEventListener('click', () => handlePayment(grandTotal));
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
  };

  render();
}