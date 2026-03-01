/* TOOLBOXPAY v22.14 - LIVE ENGINE [cite: 2026-03-01] */
document.addEventListener('DOMContentLoaded', () => {
    console.log("ToolboxPay Engine Started");

    // 1. AUTO-SAVE TO LOCAL STORAGE [cite: 2026-02-26]
    const saveFields = document.querySelectorAll('.save-field');
    saveFields.forEach(field => {
        const savedValue = localStorage.getItem(`tbox_${field.id}`);
        if (savedValue) field.value = savedValue;

        field.addEventListener('input', () => {
            localStorage.setItem(`tbox_${field.id}`, field.value);
        });
    });

    // 2. VAT CALCULATION [cite: 2026-02-28]
    const vIn = document.getElementById('vIn');
    const vOut = document.getElementById('vOut');
    if(vIn && vOut) {
        vIn.addEventListener('input', () => {
            const val = parseFloat(vIn.value) || 0;
            vOut.innerText = "£" + (val * 1.2).toLocaleString('en-GB', {minimumFractionDigits: 2});
        });
    }

    // 3. BUSINESS CALCULATION (LABOUR & MATERIALS) [cite: 2020-02-20]
    const bL = document.getElementById('bL');
    const bM = document.getElementById('bM');
    const bMk = document.getElementById('bMk');
    const bQ = document.getElementById('bQ');

    const runBiz = () => {
        if(!bQ) return;
        const l = parseFloat(bL.value) || 0;
        const m = parseFloat(bM.value) || 0;
        const k = (parseFloat(bMk.value) || 0) / 100;
        const total = (l + m) * (1 + k);
        bQ.innerText = "£" + total.toLocaleString('en-GB', {minimumFractionDigits: 2});
    };

    [bL, bM, bMk].forEach(el => {
        if(el) el.addEventListener('input', runBiz);
    });
});
