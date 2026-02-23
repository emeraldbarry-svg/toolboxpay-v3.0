/**
 * toolboxpay - Production Master v5.4
 * Feature: Login Recovery & Confirmation Bypass
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let session: any = null;
  let isSigningUp = false;
  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  const handleAuth = async () => {
    if (!email || !password) {
      errorMessage = "Please enter both credentials.";
      render();
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    render();

    try {
      if (isSigningUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If sign up works but no session, they need to be confirmed in dashboard
        if (data.user && !data.session) {
          errorMessage = "Account created but needs confirming in the Supabase Dashboard.";
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        session = data.session;
      }
    } catch (err: any) {
      if (err.message.includes("already registered")) {
        errorMessage = "You already have an account! Please try to Login instead of signing up.";
        isSigningUp = false; // Automatically switch them to login mode
      } else if (err.message.includes("Email not confirmed")) {
        errorMessage = "Account exists but is not confirmed. Please confirm it in your Supabase Dashboard.";
      } else {
        errorMessage = err.message;
      }
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
          <div style="text-align:center; margin-bottom:30px;">
            <span style="color:orange; font-weight:800; font-size:2.8rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:2.8rem;">pay</span>
          </div>

          <div style="background:rgba(0,0,0,0.25); padding:25px; border-radius:20px; border:1px solid #444;">
            ${errorMessage ? `
              <div style="background:rgba(255,165,0,0.1); border:1px solid orange; color:orange; padding:12px; border-radius:8px; margin-bottom:15px; font-size:0.8rem; text-align:center; line-height:1.4;">
                ${errorMessage}
              </div>
            ` : ''}
            
            <input id="email-in" type="email" placeholder="Email" value="${email}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
            <input id="pass-in" type="password" placeholder="Password" value="${password}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:20px; box-sizing:border-box;">
            
            <button id="auth-btn" style="width:100%; padding:20px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900;">
              ${isLoading ? 'PLEASE WAIT...' : isSigningUp ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}
            </button>

            <div style="display:flex; justify-content:space-between; margin-top:20px;">
              <button id="toggle-mode" style="background:none; border:none; color:#a4b0be; font-size:0.8rem;">
                ${isSigningUp ? 'Switch to Login' : 'Need an account?'}
              </button>
              <button id="reset-ui" style="background:none; border:none; color:#636e72; font-size:0.8rem;">Clear Fields</button>
            </div>
          </div>
        </div>
      `;
      root.appendChild(app);

      document.getElementById('email-in')?.addEventListener('input', (e) => email = (e.target as HTMLInputElement).value);
      document.getElementById('pass-in')?.addEventListener('input', (e) => password = (e.target as HTMLInputElement).value);
      document.getElementById('auth-btn')?.addEventListener('click', handleAuth);
      document.getElementById('toggle-mode')?.addEventListener('click', () => { isSigningUp = !isSigningUp; errorMessage = ''; render(); });
      document.getElementById('reset-ui')?.addEventListener('click', () => { email = ''; password = ''; errorMessage = ''; render(); });
      return;
    }

    // Success Header for all tabs
    app.innerHTML = `
      <div style="padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;">
        <button id="logout-btn" style="background:none; border:none; color:#636e72; font-size:0.6rem; font-weight:bold;">LOGOUT</button>
        <div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div>
        <div></div>
      </div>
      <div style="padding:40px; text-align:center; flex:1;">
        <h2 style="color:orange;">Active Session</h2>
        <p style="font-size:0.9rem; color:#a4b0be;">Logged in as: ${session.user.email}</p>
        <div style="margin-top:40px; padding:20px; background:rgba(0,0,0,0.1); border-radius:12px; border:1px solid #444;">
          Tap the menu below to start.
        </div>
      </div>
    `;
    root.appendChild(app);
    document.getElementById('logout-btn')?.addEventListener('click', () => supabase.auth.signOut());
  };

  render();
}