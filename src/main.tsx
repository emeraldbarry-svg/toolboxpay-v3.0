/**
 * toolboxpay - Production Master v5.5
 * Feature: Password Reset & Recovery Flow
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

  // Check if we are returning from a password reset email
  if (window.location.hash.includes('type=recovery')) {
    authMode = 'UPDATE';
  }

  const handleAuth = async () => {
    isLoading = true;
    message = '';
    render();

    try {
      if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (authMode === 'SIGNUP') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        message = "Account created! Please check your email.";
      } else if (authMode === 'FORGOT') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        message = "Recovery email sent. Please check your inbox.";
      } else if (authMode === 'UPDATE') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        message = "Password updated successfully! You can now login.";
        authMode = 'LOGIN';
      }
    } catch (err: any) {
      message = err.message;
    }

    isLoading = false;
    render();
  };

  supabase.auth.onAuthStateChange((event, currentSession) => {
    session = currentSession;
    if (event === 'PASSWORD_RECOVERY') authMode = 'UPDATE';
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
            <h2 style="font-size:1rem; margin-bottom:20px; text-align:center; color:orange;">
              ${authMode === 'FORGOT' ? 'Reset Password' : authMode === 'UPDATE' ? 'Set New Password' : authMode === 'SIGNUP' ? 'Create Account' : 'Secure Login'}
            </h2>

            ${message ? `<div style="background:rgba(255,165,0,0.1); border:1px solid orange; color:orange; padding:12px; border-radius:8px; margin-bottom:15px; font-size:0.8rem; text-align:center;">${message}</div>` : ''}
            
            ${authMode !== 'UPDATE' ? `
              <input id="email-in" type="email" placeholder="Email" value="${email}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:15px; box-sizing:border-box;">
            ` : ''}

            ${authMode !== 'FORGOT' ? `
              <input id="pass-in" type="password" placeholder="${authMode === 'UPDATE' ? 'Enter new strong password' : 'Password'}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:15px; border-radius:10px; margin-bottom:20px; box-sizing:border-box;">
            ` : ''}
            
            <button id="auth-btn" style="width:100%; padding:20px; background:orange; color:#000; border:none; border-radius:12px; font-weight:900;">
              ${isLoading ? 'PROCESSING...' : authMode === 'FORGOT' ? 'SEND RESET LINK' : authMode === 'UPDATE' ? 'UPDATE PASSWORD' : authMode === 'SIGNUP' ? 'SIGN UP' : 'LOGIN'}
            </button>

            <div style="display:flex; flex-direction:column; gap:15px; margin-top:25px; text-align:center;">
              ${authMode === 'LOGIN' ? `
                <button id="to-forgot" style="background:none; border:none; color:#a4b0be; font-size:0.8rem;">Forgot password?</button>
                <button id="to-signup" style="background:none; border:none; color:orange; font-size:0.8rem; font-weight:bold;">Create an account</button>
              ` : `
                <button id="to-login" style="background:none; border:none; color:#a4b0be; font-size:0.8rem;">Back to Login</button>
              `}
            </div>
          </div>
        </div>
      `;
      root.appendChild(app);

      document.getElementById('email-in')?.addEventListener('input', (e) => email = (e.target as HTMLInputElement).value);
      document.getElementById('pass-in')?.addEventListener('input', (e) => password = (e.target as HTMLInputElement).value);
      document.getElementById('auth-btn')?.addEventListener('click', handleAuth);
      document.getElementById('to-forgot')?.addEventListener('click', () => { authMode = 'FORGOT'; message = ''; render(); });
      document.getElementById('to-signup')?.addEventListener('click', () => { authMode = 'SIGNUP'; message = ''; render(); });
      document.getElementById('to-login')?.addEventListener('click', () => { authMode = 'LOGIN'; message = ''; render(); });
      return;
    }

    // Authenticated App Shell
    app.innerHTML = `
      <div style="padding:15px; background:#111; border-bottom:1px solid #333; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;">
        <button id="logout-btn" style="background:none; border:none; color:#636e72; font-size:0.6rem; font-weight:bold;">LOGOUT</button>
        <div style="display:flex; align-items:center;"><span style="color:orange; font-weight:800; font-size:1.3rem;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.3rem;">pay</span></div>
        <div></div>
      </div>
      <div style="padding:40px; text-align:center;">
        <h2 style="color:orange;">Logged In</h2>
        <p style="color:#a4b0be;">Account: ${session.user.email}</p>
      </div>
    `;
    root.appendChild(app);
    document.getElementById('logout-btn')?.addEventListener('click', () => { supabase.auth.signOut(); });
  };

  render();
}