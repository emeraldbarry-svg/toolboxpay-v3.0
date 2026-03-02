/* TOOLBOXPAY v22.35 - FULL FUNCTION ENGINE [cite: 2026-03-02] */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PAGE NAVIGATION [cite: 2026-03-02]
    window.showPage = (pageId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.reel-btn').forEach(b => b.classList.remove('active'));
        
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
        
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }
    };

    // 2. AUTO-SAVE & RECALL [cite: 2026-02-26]
    // Remembers business and bank details automatically [cite: 2026-02-26]
    const fields = ['fn_name', 'fn_trade', 'fn_addr', 'fn_bank', 'fn_sort', 'fn_acc'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = localStorage.getItem(`tbox_${id}`) || '';
            el.addEventListener('input', () => {
                localStorage.setItem(`tbox_${id}`, el.value);
            });
        }
    });

    // 3. VAT CALCULATOR (20% UK Standard) [cite: 2026-03-02]
    const vIn = document.getElementById('vIn');
    const vOut = document.getElementById('vOut');
    if (vIn && vOut) {
        vIn.addEventListener('input', () => {
            const net = parseFloat(vIn.value) || 0;
            const total = net * 1.20;
            vOut.innerText = "£" + total.toLocaleString('en-GB', {minimumFractionDigits: 2});
        });
    }

    // 4. BUSINESS CALCULATOR (Labour + Materials + Markup) [cite: 2026-03-02]
    const bL = document.getElementById('bL'); // Labour [cite: 2026-03-02]
    const bM = document.getElementById('bM'); // Materials [cite: 2026-03-02]
    const bMk = document.getElementById('bMk'); // Markup [cite: 2026-03-02]
    const bQ = document.getElementById('bQ'); // Quote Result [cite: 2026-03-02]

    const calculateQuote = () => {
        const labour = parseFloat(bL.value) || 0;
        const materials = parseFloat(bM.value) || 0;
        const markupPercent = (parseFloat(bMk.value) || 0) / 100;
        
        const subtotal = labour + materials;
        const total = subtotal + (subtotal * markupPercent);
        
        if (bQ) {
            bQ.innerText = "£" + total.toLocaleString('en-GB', {minimumFractionDigits: 2});
        }
    };

    [bL, bM, bMk].forEach(input => {
        input?.addEventListener('input', calculateQuote);
    });
});
