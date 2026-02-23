/**
 * toolboxpay - Production Master v7.2
 * Feature: Black-Screen Force Recovery & Safety Logic
 * Theme: Orange/White | British English
 */

import { createClient } from '@supabase/supabase-js';

const APP_VERSION = "7.2.0";

// --- GLOBAL SAFETY CONFIG ---
const root = document.getElementById('root');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (root) {
  // State variables with hard-coded defaults to prevent black-out
  let activeTab = 'BILLING';
  let paymentStatus: 'IDLE' | 'SUCCESS' = 'IDLE';
  let clientName = '';
  let amount = 0;
  let transactionType: 'IN' | 'OUT' = 'IN';
  let history: any[] = [];

  // 1. Safe History Load
  try {
    const saved = localStorage.getItem('toolboxpay_audit_log');
    if (saved) history = JSON.parse(saved);
  } catch (err) {
    console.warn("Storage Reset");
    history = [];
  }

  // 2. Success URL Parser (British Date Format)
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    paymentStatus = 'SUCCESS';
    clientName = params.get('client') || 'Customer';
    const total = Number(params.get('total')) || 0;
    const type = (params.get('type') as 'IN' | 'OUT') || 'IN';
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Check if already logged to prevent duplicates on refresh
    const lastId = history.length > 0 ? history[0].id : 0;
    if (Date.now() - lastId > 2000) { 
      history = [{ id: Date.now(), name: clientName, total, type, time: timestamp }, ...history].slice(0, 20);
      localStorage.setItem('toolboxpay_audit_log', JSON.stringify(history));
    }
  }

  const render = () => {
    if (!root) return;

    // Build the UI String
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let viewContent = '';

    if (paymentStatus === 'SUCCESS') {
      viewContent = `
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px;">
          <div style="width:100px; height:100px; background:#fff; border: 6px solid #2ecc71; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:25px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style="font-size:1.6rem; font-weight:900; margin:0;">Action Logged</h2>
          <p style="color:orange; font-weight:bold; font-size:1.2rem; margin:10px 0;">${clientName}</p>
          <button id="done-btn" style="margin-top:30px; width:100%; max-width:250px; padding:20px; background:orange; color:#000; border:none; border-radius:15px; font-weight:900; cursor:pointer;">NEW ENTRY</button>
        </div>
      `;
    } else if (activeTab === 'BILLING') {
      viewContent = `
        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid #444; margin-bottom:20px;">
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">RECIPIENT / CLIENT NAME</label>
          <input id="client-in" type="text" placeholder="Full Name" value="${clientName}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:15px; box-sizing:border-box;">
          
          <label style="font-size:0.7rem; color:#a4b0be; display:block; margin-bottom:8px;">AMOUNT (£)</label>
          <input id="amt-in" type="number" placeholder="0.00" value="${amount || ''}" style="width:100%; background:#111; border:1px solid #555; color:#fff; padding:18px; border-radius:12px; margin-bottom:20px; box-sizing:border-box; font-size:1.2rem; font-weight:bold;">
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button id="set-in" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'IN' ? 'orange' : '#333'}; color:${transactionType === 'IN' ? '#000' : '#fff'}; cursor:pointer;">INCOMING</button>
            <button id="set-out" style="padding:15px; border-radius:10px; border:none; font-weight:900; background:${transactionType === 'OUT' ? 'orange' : '#333'}; color:${transactionType === 'OUT' ? '#000' : '#fff'}; cursor:pointer;">OUTGOING</button>
          </div>
        </div>
        <button id="process-btn" style="width:100%; padding:22px; background:#2ecc71; color:#fff; border:none; border-radius:15px; font-weight:900; font-size:1rem; cursor:pointer;">CONFIRM TRANSACTION</button>
      `;
    } else if (activeTab === 'ADMIN') {
      viewContent = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2 style="color:orange; font-size:1.1rem; text-transform:uppercase; margin:0;">Audit Log</h2>
          <span style="font-size:0.6rem; color:#636e72;">v${APP_VERSION}</span>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${history.length === 0 ? '<p style="color:#636e72; text-align:center;">No activity logged.</p>' : history.map(item => `
            <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; border-left:4px solid ${item.type === 'IN' ? '#2ecc71'