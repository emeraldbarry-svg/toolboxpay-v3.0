/* TOOLBOXPAY v22.43 - VAT & DISPLAY REPAIR [cite: 2026-03-02] */
document.addEventListener('DOMContentLoaded', () => {
    
    // NAVIGATION [cite: 2026-03-01]
    window.showPage = (pageId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.reel-btn').forEach(b => b.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
        if (event && event.currentTarget) event.currentTarget.classList.add('active');
    };

    // UNIVERSAL AUTO-SAVE [cite: 2026-02-26]
    document.querySelectorAll('.save-field').forEach(field => {
        field.value = localStorage.getItem(`tbox_${field.id}`) || '';
        field.addEventListener('input', () => {
            localStorage.setItem(`tbox_${field.id}`, field.value);
        });
    });

    // VAT CALCULATOR ENGINE - FIXED [cite: 2026-03-02]
    const vIn = document.getElementById('vIn');
    const vTax = document.getElementById('vTax');
    const vOut = document.getElementById('vOut');
    
    vIn?.addEventListener('input', () => {
        const net = parseFloat(vIn.value) || 0;
        const tax = net * 0.20; // The 20% portion [cite: 2026-03-02]
        const total = net + tax;
        
        // This line fixes the £0.00 error in your screenshot
        if (vTax) vTax.innerText = "£" + tax.toLocaleString('en-GB', {minimumFractionDigits: 2});
        if (vOut) vOut.innerText = "£" + total.toLocaleString('en-GB', {minimumFractionDigits: 2});
    });

    // BUSINESS CALCULATOR ENGINE [cite: 2026-03-02]
    const bL = document.getElementById('bL'), bM = document.getElementById('bM'), 
          bMk = document.getElementById('bMk'), bSub = document.getElementById('bSub'), bQ = document.getElementById('bQ');

    const updateBizCalc = () => {
        const labour = parseFloat(bL.value) || 0;
        const materials = parseFloat(bM.value) || 0;
        const markup = (parseFloat(bMk.value) || 0) / 100;
        const subtotal = labour + materials;
        const grandTotal = subtotal * (1 + markup);
        
        if (bSub) bSub.innerText = "£" + subtotal.toLocaleString('en-GB', {minimumFractionDigits: 2});
        if (bQ) bQ.innerText = "£" + grandTotal.toLocaleString('en-GB', {minimumFractionDigits: 2});
    };

    [bL, bM, bMk].forEach(input => input?.addEventListener('input', updateBizCalc));
});
