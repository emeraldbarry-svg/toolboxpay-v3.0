/* v22.08 - Senior Frontend Engineering Update 
   Focus: VAT Integration and Currency Localisation [cite: 2026-03-01]
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS - BUSINESS CALC [cite: 2026-03-01]
    const labourInput = document.getElementById('bL');
    const materialInput = document.getElementById('bM');
    const markupInput = document.getElementById('bMk');
    const bizOutput = document.getElementById('bQ');
    const bizCard = document.getElementById('calcSection');

    // 2. SELECTORS - VAT CALC [cite: 2026-03-01]
    const vatInput = document.getElementById('vIn');
    const vatOutput = document.getElementById('vOut');
    const vatCard = document.querySelector('.card:has(#vIn)'); // Targets the VAT card container

    // 3. SELECTORS - GENERAL [cite: 2026-02-28]
    const topBtn = document.getElementById('goTop');

    /**
     * BUSINESS CALCULATION ENGINE [cite: 2020-02-20]
     */
    const calculateBizResults = () => {
        const l = parseFloat(labourInput.value) || 0;
        const m = parseFloat(materialInput.value) || 0;
        const mk = (parseFloat(markupInput.value) || 0) / 100;

        // Validation States [cite: 2026-03-01]
        if (labourInput.value !== "" && l < 0) {
            labourInput.classList.add('has-error');
        } else {
            labourInput.classList.remove('has-error');
        }

        if (bizCard) {
            bizCard.classList.add('is-active');
            setTimeout(() => bizCard.classList.remove('is-active'), 600);
        }

        const total = (l + m) * (1 + mk);
        bizOutput.innerText = "£" + total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    /**
     * VAT CALCULATION ENGINE [cite: 2026-02-28]
     */
    const calculateVAT = () => {
        if (!vatInput || !vatOutput) return;

        const net = parseFloat(vatInput.value) || 0;
        const gross = net * 1.20; // Standard 20% VAT [cite: 2026-02-28]

        // Trigger Orange Glow State [cite: 2020-02-21]
        if (vatCard) {
            vatCard.classList.add('is-active');
            setTimeout(() => vatCard.classList.remove('is-active'), 600);
        }

        vatOutput.innerText = "£" + gross.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // 4. ATTACH EVENT LISTENERS [cite: 2026-03-01]
    if (labourInput) labourInput.addEventListener('input', calculateBizResults);
    if (materialInput) materialInput.addEventListener('input', calculateBizResults);
    if (markupInput) markupInput.addEventListener('input', calculateBizResults);
    
    if (vatInput) vatInput.addEventListener('input', calculateVAT);

    // 5. NAVIGATION LOGIC [cite: 2026-02-28]
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
