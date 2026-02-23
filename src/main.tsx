/**
 * toolboxpay - Production Master v5.0
 * Feature: Secure User Authentication & Personalised Profiles
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let session = null;
  let activeTab = 'BILLING';
  let email = '';
  let password = '';
  let isLoading = false;

  // --- AUTH LOGIC ---
  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    isLoading = true;
    render();
    const { data, error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
    isLoading = false;
    render();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    render();
  };

  // Check for active session on load
  supabase.auth.onAuthStateChange((_event, currentSession) => {
    session = currentSession;
    render();
  });

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    // --- LOGIN SCREEN ---
    if (!session) {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:30px;">
          <div style="text-align:center; margin-bottom:40px;">
            <span style="color:orange; font-weight:800; font-size:2.5rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:2.5rem;">pay</span>
            <p style="color:#a4b0be; margin-top:10px;">The Professional Mobile Terminal</p>
          </div>
          <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; border:1px solid #444;">
            <input id="email-in" type="email" placeholder="Email Address" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px;">
            <input id="pass-in" type="password" placeholder="Password" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:20px;">
            <button id="login-btn" style="width:100%; padding:18px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900; margin-bottom:10px;">${isLoading ? 'PROCESSING...' : 'LOGIN'}</button>
            <button id="signup-btn" style="width:100%; padding:10px; background:none; color:orange; border:none; font-weight:bold; font-size:0.8rem;">CREATE NEW ACCOUNT</button>
          </div>
        </div>
      `;
      root.appendChild(app);
      
      const eIn = document.getElementById('email-in') as HTMLInputElement;
      if (eIn) eIn.oninput = (e) => email = (e.target as HTMLInputElement).value;
      const pIn = document.getElementById('pass-in') as HTMLInputElement;
      if (pIn) pIn.oninput = (e) => password = (e.target as HTMLInputElement).value;
      
      document.getElementById('login-btn')?.addEventListener('click', () => handleAuth('LOGIN'));
      document.getElementById('signup-btn')?.addEventListener('click', () => handleAuth('SIGNUP'));
      return;
    }

    // --- MAIN APP UI (Once logged in) ---
    const header = document.createElement('div');
    header.style.cssText = "padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;";
    header.innerHTML = `
      <button id="logout-btn" style="background:none; border:none; color:#636e72; font-size:0.6rem; font-weight:bold;">LOGOUT</button>
      <div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div>
      <div></div>
    `;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto; text-align:center;";
    content.innerHTML = `
      <h2 style="color:orange; margin-top:40px;">Welcome back</h2>
      <p style="color:#a4b0be;">Logged in as: ${session.user.email}</p>
      <div style="margin-top:30px; padding:20px; background:rgba(0,0,0,0.2); border-radius:15px; border:1px solid orange;">
        Your terminal is ready. Use the menu below to start billing.
      </div>
    `;
    app.appendChild(content);

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

    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
  };

  render();
}