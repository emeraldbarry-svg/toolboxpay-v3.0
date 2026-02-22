import React from 'react';

// British English branding constants [cite: 2026-02-20]
const toolboxBrand = {
  theme: {
    primary: 'orange',
    secondary: 'white',
    bg: '#111'
  },
  labels: {
    specialising: 'Specialising',
    labour: 'Labour'
  }
};

const App = () => {
  // Mock data for the dashboard to break away from the splash screen [cite: 2026-02-21]
  const entries = [
    { id: 1, name: 'Bricklaying Labour', price: '£400.00', status: 'Paid' },
    { id: 2, name: 'Roofing Labour', price: '£850.00', status: 'Invoiced' }
  ];

  return (
    <div style={{ 
      backgroundColor: toolboxBrand.theme.bg, 
      minHeight: '100vh', 
      color: 'white', 
      fontFamily: 'sans-serif',
      padding: '40px'
    }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>
          <span style={{ color: toolboxBrand.theme.primary }}>toolbox</span>
          <span style={{ color: toolboxBrand.theme.secondary }}>pay</span>
        </h1>
        <div style={{ color: '#4caf50', fontWeight: 'bold' }}>● Engine Online</div>
      </div>

      {/* Content Area */}
      <main style={{ marginTop: '50px' }}>
        <h2 style={{ fontSize: '2rem' }}>
          {toolboxBrand.labels.specialising} in Trade Payments
        </h2>
        
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', marginTop: '30px' }}>
          <h3 style={{ color: toolboxBrand.theme.primary }}>Recent {toolboxBrand.labels.labour} Costs</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {entries.map(e => (
              <li key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #333' }}>
                <span>{e.name}</span>
                <span style={{ fontWeight: 'bold' }}>{e.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer style={{ marginTop: '50px', color: '#666', fontSize: '0.8rem' }}>
        Current Locale: United Kingdom (en-GB) [cite: 2026-02-20]
      </footer>
    </div>
  );
};

export default App;