/**
 * toolboxpay - Production Master v7.1
 * Feature: White-Screen Recovery & Error Shielding
 * Theme: Orange/White | British English
 */

import { createClient } from '@supabase/supabase-js';

const APP_VERSION = "7.1.0";

// --- SAFETY INITIALISATION ---
const root = document.getElementById('root');

// Initialise Supabase safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (root) {
  let activeTab = 'BILLING';
  let paymentStatus: 'IDLE' | 'SUCCESS' = 'IDLE';
  let clientName = '';
  let amount = 0;
  let transactionType: 'IN' | 'OUT' = 'IN';
  
  // Safe History Loading
  let history: any[] = [];
  try {
    const saved = localStorage.getItem('toolboxpay_audit_log');
    history = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("History Corrupted - Resetting");
    history = [];
  }

  // Safe Clock Start
  let currentTime = "00:00:00";
  const updateTime = () => {
    currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const el = document.getElementById('live-clock');
    if (el) el.innerText = currentTime;
  };
  setInterval(updateTime, 1000);

  // Success Logic Parser
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true' && paymentStatus === 'IDLE') {
    paymentStatus = 'SUCCESS';
    clientName = params.get('client') || 'Customer';
    const total = Number(params.get('total')) || 0;
    const type = (params.get('type') as 'IN' | 'OUT') || 'IN';
    const timestamp = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    history = [{ id: Date.now(), name: clientName, total, type, time: timestamp }, ...history].slice(0, 20);
    localStorage.setItem('toolboxpay_audit_log', JSON.stringify(history));
  }

  const render = () => {
    if (!root) return;
    
    // Create Layout
    const app = document.createElement('div');
    app.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; overflow:hidden;";

    // --- REPAIRED HEADER ---
    const header = document.createElement('div');
    header.style.cssText = "padding:18px 15px; background:#111; border-bottom:1px solid #333; position:relative; display:flex; flex-direction:column; align-items:center; flex-shrink:0;";
    header.innerHTML = `
      <div id="live-clock" style="position:absolute; right:15px; top:22px; color:orange; font-family:monospace; font-size:0.75rem; font-weight:bold;">${currentTime}</div>
      <div style="display:flex; align-items:center; gap:2px;">
        <span style="color:orange; font-weight:800; font-size:1.5rem; letter-spacing:-1.5px;">toolbox</span><span style="color:#fff; font-weight:400; font-size:1.5rem; letter-spacing:-1.5px;">pay</span>
      </div>
      <div style="color:orange; font-size:0.6rem; font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-top:2px;">Payments</div>
    `;
    app.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = "flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column;";

    if (paymentStatus === 'SUCCESS') {
      content.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
          <div style="width:100px; height:100px; background:#fff; border: 6px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:25px;">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style="font-size:1.6rem; font-weight:900;">Action Logged</h2>
          <p style="color:orange; font-weight:bold; font-size:1.2rem; margin:10px 0;">${clientName}</p>
          <button id="done-btn" style="margin-top:30px; width:100%; max-width:250px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900;">CONTINUE</button>
        </div>
      `;
    } else if (activeTab === 'BILLING') {
      content.innerHTML = `
        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">RECIPIENT / CLIENT NAME</label>
          <input id="client-in" type="text" placeholder="Name" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box; font-size:1rem;">
          
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">AMOUNT (£)</label>
          <input id="amt-in" type="number" placeholder="0.00" value="${amount || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:20px; box-sizing:border-box; font-size:1.2rem; font-weight:bold;">
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button id="set-in" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'IN' ? 'orange' : '#333'}; color:${transactionType === 'IN' ? '#000' : '#fff'};">INCOMING</button>
            <button id="set-out" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'OUT' ? 'orange' : '#333'}; color:${transactionType === 'OUT' ? '#000' : '#fff'};">OUTGOING</button>
          </div>
        </div>
        <button id="process-btn" style="width:100%; padding:22px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900; font-size:1rem;">CONFIRM TRANSACTION