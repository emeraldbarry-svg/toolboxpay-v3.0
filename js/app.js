/* TOOLBOXPAY v22.32 - REEL LOGIC [cite: 2026-03-02] */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SWITCHING PAGES (Hides the stack) [cite: 2026-03-01]
    window.showPage = (pageId) => {
        // Hide all sections first [cite: 2026-03-02]
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
            p.classList.remove('active');
        });
        
        // Deactivate all buttons [cite: 2026-03-02]
        document.querySelectorAll('.reel-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Show only the selected page [cite: 2026-03-02]
        const target = document.getElementById(pageId);
        if (target) {
            target.style.display = 'block';
            target.classList.add('active');
        }
        
        // Highlight the clicked button [cite: 2026-03-02]
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }
    };

    // 2. AUTO-SAVE DATA [cite: 2026-02-26]
    document.querySelectorAll('.save-field').forEach(field => {
        field.value = localStorage.getItem(`tbox_${field.id}`) || '';
        field.addEventListener('input', () => {
            localStorage.setItem(`tbox_${field.id}`, field.value);
        });
    });

    // 3. BUSINESS CALCULATOR ENGINE [cite: 2026-03-01]
    const bL = document.getElementById('bL'); // Labour [cite: 2026-03-02]
    const bM = document.getElementById('bM'); // Materials [cite: 2026-03-02]
    const bMk = document.getElementById('bMk'); // Markup [cite: 2026-03-02]
    const bQ = document.getElementById('bQ'); // Result [cite: 2026-03-02]

    const runCalc = () => {
        const labour = parseFloat(bL.value) || 0;
        const materials = parseFloat(bM.value) || 0;
        const markup = (parseFloat(bMk.value) || 0) / 100;
        const total = (labour + materials) * (1 + markup);
        if (bQ) bQ.innerText = "£" + total.toLocaleString('en-GB', {minimumFractionDigits: 2});
    };

    [bL, bM, bMk].forEach(el => el?.addEventListener('input', runCalc));
});
