/**
 * toolboxpay - Production Master v5.7
 * Feature: Deep-Link Recovery Catching
 * Theme: Orange & White | British English
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

if (root) {
  let session: any = null;
  let authMode: 'LOGIN' | 'SIGNUP' | 'FORGOT' | 'UPDATE' = 'LOGIN';
  let email = '';
  let password = '';
  let isLoading = false;
  let message = '';

  // --- THE RECOVERY CATCHER ---
  // Detects if the user has arrived via a reset email link
  const checkRecovery = () => {
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
      authMode = 'UPDATE';
      message = "Link verified. Please set your new password below.";
    }
  };

  const handleAuth = async () => {
    isLoading = true;
    message = '';
    render();

    try {
      if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (authMode === 'FORGOT') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        message = "Reset link sent! Please check your spam folder if it doesn't arrive.";
      } else if (authMode === 'UPDATE') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        message = "Success! Password updated. You can now login.";
        authMode = 'LOGIN';
        password = ''; // Clear password field
      }
    } catch (err: any) {
      message = err.message;
    }

    isLoading = false;
    render();
  };

  supabase.auth.onAuthStateChange((event, currentSession) => {
    session = currentSession;
    if (event === 'PASSWORD_RECOVERY') {
      authMode = 'UPDATE';
      render();
    }
    render();
  });

  const render = () => {
    if (!root) return;
    root.innerHTML = '';

    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; padding-top:env(safe-area-inset-top);";

    if (!session || authMode === 'UPDATE') {
      app.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:30px; max-width:450px; margin:0 auto; width:100%; box-sizing:border-box;">
          <div style="text-align:center; margin-bottom:30px;">
            <span style="color:orange; font-weight:800; font-size:2.8rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:2.8rem;">pay</span>
          </div>

          <div style="background:rgba(0,0,0,0.25); padding:25px; border-radius:20px; border:1px solid #444;">
            <h2 style="font-size:1rem; margin-bottom:20px; text-align:center; color:orange; text-transform:uppercase; letter-spacing:1px;">
              ${authMode === 'UPDATE' ? 'Set New Password' : authMode === 'FORGOT' ? 'Recover Account' : 'Secure Login'}
            </h2>

            ${message ? `<div style="background:rgba(255,165,0,0.1); border:1px solid orange; color:orange; padding:12px; border-radius:8px; margin-bottom:15px; font-size:0.8rem; text-align:center; line-height:1.4;">${message}</div>` : ''}
            
            ${authMode !== 'UPDATE' ? `
              <input id="email-in" type="email" placeholder="Email Address" value="${email}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
            ` : ''}

            <input id="pass-in" type="password" placeholder="${authMode === 'UPDATE' ? 'New Password' : 'Password'}" value="${password}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:20px; box-sizing:border-box;">
            
            <button id="auth-btn" style="width:100%; padding:20px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900;">
              ${isLoading ? 'PROCESSING...' : authMode === 'UPDATE' ? 'SAVE PASSWORD' : authMode === 'FORGOT' ? 'SEND RESET LINK' : 'LOGIN'}
            </button>

            <div style="margin-top:20px; text-align:center;">
              <button id="to-mode" style="background:none; border:none; color:#a4b0be; font-size:0.8rem;">
                ${authMode === 'LOGIN' ? 'Forgot password?' : 'Back to Login'}
              </button>
            </div>
          </div>
        </div>
      `;
      root.appendChild(app);

      document.getElementById('email-in')?.addEventListener('input', (e) => email = (e.target as HTMLInputElement).value);
      document.getElementById('pass-in')?.addEventListener('input', (e) => password = (e.target as HTMLInputElement).value);
      document.getElementById('auth-btn')?.addEventListener('click', handleAuth);
      document.getElementById('to-mode')?.addEventListener('click', () => {
        authMode = authMode === 'LOGIN' ? 'FORGOT' : 'LOGIN';
        message = '';
        render();
      });
      return;
    }

    // Main App Shell (Placeholder)
    app.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h1 style="color:orange;">Logged In</h1>
        <button id="logout-btn" style="background:orange; color:#000; padding:10px 20px; border:none; border-radius:8px;">Logout</button>
      </div>
    `;
    root.appendChild(app);
    document.getElementById('logout-btn')?.addEventListener('click', () => supabase.auth.signOut());
  };

  checkRecovery(); // Run immediately on load
  render();
}