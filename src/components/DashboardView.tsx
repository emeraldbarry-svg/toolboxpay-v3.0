import React from 'react';

export default function DashboardView() {
  const stats = [
    { label: 'Total Estimates', value: '£12,450', color: 'text-white' },
    { label: 'Pending Quotes', value: '8', color: 'text-[#ff8c00]' },
    { label: 'Conversion Rate', value: '64%', color: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#121926] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
            {stat.label}
          </h3>
          <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}