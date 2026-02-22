import React, { useState } from 'react';

export default function ManualEntryForm() {
  const [labour, setLabour] = useState('0.00');
  const [parts, setParts] = useState('0.00');
  const [total, setTotal] = useState<number | null>(null);

  const calculateTotal = () => {
    const hourlyRate = 85; // Standard industrial rate
    const subtotal = (parseFloat(labour) * hourlyRate) + parseFloat(parts);
    setTotal(subtotal);
  };

  return (
    <div className="bg-[#121926] p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff8c00] mb-8">Quick Entry</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Labour Hours</label>
          <input 
            type="number" 
            value={labour}
            onChange={(e) => setLabour(e.target.value)}
            className="w-full bg-[#0b0f1a] border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-[#ff8c00] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Parts Cost (£)</label>
          <input 
            type="number" 
            value={parts}
            onChange={(e) => setParts(e.target.value)}
            className="w-full bg-[#0b0f1a] border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-[#ff8c00] outline-none transition-colors"
          />
        </div>

        <button 
          onClick={calculateTotal}
          className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-black font-black uppercase py-5 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,140,0,0.2)]"
        >
          Calculate Total
        </button>

        {total !== null && (
          <div className="mt-6 pt-6 border-t border-slate-800 text-center animate-in fade-in slide-in-from-bottom-2">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Total</p>
            <p className="text-3xl font-black text-white">£{total.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}