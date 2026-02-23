/**
 * toolboxpay - Production Master v5.1
 * Feature: Strong Password Suggestions & Auth UI
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let session = null;
  let isSigningUp = false; // Toggle between Login and Sign-up UI
  let email = '';
  let password = '';
  let isLoading = false;

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    
    isLoading = true;
    render();

    const { error } = isSigningUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (isSigningUp) {
      alert("Account created! Please check your email for a confirmation link (if enabled).");
    }

    isLoading = false;
    render();
  };

  supabase.auth.onAuthStateChange((_event, currentSession) => {
    session = currentSession;
    render();
  });

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    if (!session) {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:30px; max-width:450px; margin:0 auto; width:100%; box-sizing:border-box;">
          <div style="text-align:center; margin-bottom:40px;">
            <span style="color:orange; font-weight:800; font-size:2.8rem; letter-spacing:-1px;">toolbox</span><span style="color:#fff; font-weight:400; font-size:2.8rem;">pay</span>
            <p style="color:#a4b0be; margin-top:10px; font-size:0.9rem;">${isSigningUp ? 'Join the professional trade network' : 'Secure Terminal Login'}</p>
          </div>

          <div style="background:rgba(0,0,0,0.25); padding:25px; border-radius:20px; border:1px solid #444; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px; font-weight:bold;">EMAIL ADDRESS</label>
            <input id="email-in" type="email" autocomplete="email" placeholder="e.g. j.blogs@gmail.com" value="${email}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:20px; box-sizing:border-box;">
            
            <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px; font-weight:bold;">PASSWORD</label>
            <input id="pass-in" 
                   type="password" 
                   ${isSigningUp ? 'autocomplete="new-password"' : 'autocomplete="current-password"'} 
                   placeholder="${isSigningUp ? 'Create a strong password' : 'Enter your password'}" 
                   value="${password}" 
                   style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:10px; box-sizing:border-box;">
            
            ${isSigningUp ? `
              <div style="display:flex; gap:4px; margin-bottom:20px;">
                <div style="height:4px; flex:1; background:${password.length > 8 ? 'orange' : '#333'}; border-radius:2px;"></div>
                <div style="height:4px; flex:1; background:${password.length > 10 ? 'orange' : '#333'}; border-radius:2px;"></div>
                <div style="height:4px; flex:1; background:${password.length > 12 ? 'orange' : '#333'}; border-radius:2px;"></div>
                <div style="height:4px; flex:1; background:${password.length > 14 ? 'orange' : '#333'}; border-radius:2px;"></div>
              </div>
            ` : '<div style="margin-bottom:20px;"></div>'}

            <button id="auth-btn" style="width:100%; padding:20px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900; font-size:1rem; cursor:pointer; transition:0.2s;">
              ${isLoading ? 'PLEASE WAIT...' : isSigningUp ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}
            </button>

            <button id="toggle-mode" style="width:100%; margin-top:20px; background:none; border:none; color:#a4b0be; font-size:0.8rem; cursor:pointer;">
              ${isSigningUp ? 'Already have an account? <span style="color:orange; font-weight:bold;">Login</span>' : 'New to toolboxpay? <span style="color:orange; font-weight:bold;">Sign up</span>'}
            </button>
          </div>
        </div>
      `;
      root.appendChild(app);

      // Listeners
      const eIn = document.getElementById('email-in') as HTMLInputElement;
      if (eIn) eIn.oninput = (e) => { email = (e.target as HTMLInputElement).value; };
      const pIn = document.getElementById('pass-in') as HTMLInputElement;
      if (pIn) pIn.oninput = (e) => { password = (e.target as HTMLInputElement).value; render(); };
      
      document.getElementById('auth-btn')?.addEventListener('click', handleAuth);
      document.getElementById('toggle-mode')?.addEventListener('click', () => {
        isSigningUp = !isSigningUp;
        password = ''; // Clear for security when switching
        render();
      });
      return;
    }

    // Authenticated View
    app.innerHTML = `
      <div style="padding:20px; text-align:center; flex:1; display:flex; flex-direction:column; justify-content:center;">
        <h1 style="color:orange;">Security Active</h1>
        <p>You are logged in as ${session.user.email}</p>
        <button id="logout-btn" style="margin-top:20px; background:none; border:1px solid #444; color:#fff; padding:10px 20px; border-radius:8px;">Logout</button>
      </div>
    `;
    root.appendChild(app);
    document.getElementById('logout-btn')?.addEventListener('click', () => supabase.auth.signOut());
  };

  render();
}