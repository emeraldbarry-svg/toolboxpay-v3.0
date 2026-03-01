/* TOOLBOXPAY v22.16 - FULL PRODUCTION LOGIC [cite: 2026-03-01] */
document.addEventListener('DOMContentLoaded', () => {
    console.log("ToolboxPay Engine v22.16 Active");

    // 1. AUTO-SAVE & RECALL [cite: 2026-02-26]
    // Remembers business and bank details automatically [cite: 2026-02-26]
    const saveFields = document.querySelectorAll('.save-field');
    saveFields.forEach(field => {
        // Load existing data from memory [cite: 2026-02-26]
        const savedValue = localStorage.getItem(`tbox_${field.id}`);
        if (savedValue) field.value = savedValue;

        // Save data every time the user types [cite: 2026-02-26]
        field.addEventListener('input', () => {
            localStorage.setItem(`tbox_${field.id}`, field.value);
        });
    });

    // 2. VAT CALCULATOR (20%) [cite: 2026-02-28]
    const vIn = document.getElementById('vIn');
    const vOut = document.getElementById('vOut');
    if (vIn && vOut) {
        vIn.addEventListener('input', () => {
            const val = parseFloat(vIn.value) || 0;
            const totalWithVat = val * 1.2;
            vOut.innerText = "£" + totalWithVat.toLocaleString('en-GB', {minimumFractionDigits: 2});
        });
    }

    // 3. BUSINESS CALC (LABOUR + MATERIALS + MARKUP) [cite: 2020-02-20]
    const bL = document.getElementById('bL'); // Labour [cite: 2020-02-20]
    const bM = document.getElementById('bM'); // Materials [cite: 2020-02-20]
    const bMk = document.getElementById('bMk'); // Markup [cite: 2020-02-20]
    const bQ = document.getElementById('bQ'); // Result Display [cite: 2020-02-20]

    const calculateBusinessTotal = () => {
        if (!bQ) return;
        const labour = parseFloat(bL.value) || 0;
        const materials = parseFloat(bM.value) || 0;
        const markupPercent = (parseFloat(bMk.value) || 0) / 100;
        
        const subtotal = labour + materials;
        const finalTotal = subtotal * (1 + markupPercent);
        
        bQ.innerText = "£" + finalTotal.toLocaleString('en-GB', {minimumFractionDigits: 2});
    };

    // Listen for any input in the calculation fields [cite: 2026-03-01]
    [bL, bM, bMk].forEach(inputElement => {
        if (inputElement) inputElement.addEventListener('input', calculateBusinessTotal);
    });
});
