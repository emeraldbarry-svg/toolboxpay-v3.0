/* TOOLBOXPAY v22.22 - FULL SYSTEM [cite: 2026-03-01] */
document.addEventListener('DOMContentLoaded', () => {
    console.log("ToolboxPay Engine v22.22 Online");

    // 1. NAVIGATION REEL [cite: 2026-03-01]
    window.showPage = (pageId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.reel-btn').forEach(b => b.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if(targetPage) targetPage.classList.add('active');
        if(event) event.currentTarget.classList.add('active');
    };

    // 2. AUTO-SAVE BANK & PROFILE [cite: 2026-02-26]
    const fields = document.querySelectorAll('.save-field');
    fields.forEach(f => {
        const saved = localStorage.getItem(`tbox_${f.id}`);
        if (saved) f.value = saved;
        f.addEventListener('input', () => localStorage.setItem(`tbox_${f.id}`, f.value));
    });

    // 3. VAT CALCULATION [cite: 2026-02-28]
    const vIn = document.getElementById('vIn');
    const vOut = document.getElementById('vOut');
    if(vIn && vOut) {
        vIn.addEventListener('input', () => {
            const val = parseFloat(vIn.value) || 0;
            vOut.innerText = "£" + (val * 1.2).toLocaleString('en-GB', {minimumFractionDigits: 2});
        });
    }

    // 4. BUSINESS CALC [cite: 2020-02-20]
    const bL = document.getElementById('bL');
    const bQ = document.getElementById('bQ');
    if(bL && bQ) {
        bL.addEventListener('input', () => {
            const val = parseFloat(bL.value) || 0;
            bQ.innerText = "£" + (val * 1.2).toLocaleString('en-GB', {minimumFractionDigits: 2});
        });
    }
});
