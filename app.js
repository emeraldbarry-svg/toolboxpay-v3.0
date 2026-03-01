/* v22.07 - Senior Frontend Engineering Update 
   Focus: State-driven logic and numerical validation [cite: 2026-03-01]
*/

document.addEventListener('DOMContentLoaded', () => {
    // Select existing elements without renaming classes [cite: 2026-03-01]
    const labourInput = document.getElementById('bL');
    const materialInput = document.getElementById('bM');
    const markupInput = document.getElementById('bMk');
    const output = document.getElementById('bQ');
    const card = document.getElementById('calcSection');
    const topBtn = document.getElementById('goTop');

    /**
     * core calculation engine
     * Handles British currency formatting and state classes [cite: 2020-02-20]
     */
    const calculateResults = () => {
        // Parse values with fallbacks [cite: 2026-03-01]
        const l = parseFloat(labourInput.value) || 0;
        const m = parseFloat(materialInput.value) || 0;
        const mk = (parseFloat(markupInput.value) || 0) / 100;

        // 1. Validate Labour Input State [cite: 2026-03-01]
        if (labourInput.value !== "" && l < 0) {
            labourInput.classList.add('has-error');
            document.getElementById('labourError').classList.remove('is-hidden');
        } else {
            labourInput.classList.remove('has-error');
            document.getElementById('labourError').classList.add('is-hidden');
        }

        // 2. Validate Material Input State [cite: 2026-03-01]
        if (materialInput.value !== "" && m < 0) {
            materialInput.classList.add('has-error');
            document.getElementById('materialError').classList.remove('is-hidden');
        } else {
            materialInput.classList.remove('has-error');
            document.getElementById('materialError').classList.add('is-hidden');
        }

        // 3. Trigger Active UI State [cite: 2026-03-01]
        if (l > 0 || m > 0) {
            card.classList.add('is-active');
            // Brief timeout to allow the orange glow to pulse [cite: 2020-02-21]
            setTimeout(() => card.classList.remove('is-active'), 600);
        }

        // 4. Final Calculation [cite: 2020-02-20]
        const total = (l + m) * (1 + mk);
        output.innerText = "£" + total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Attach listeners for real-time interaction [cite: 2026-03-01]
    if (labourInput) labourInput.addEventListener('input', calculateResults);
    if (materialInput) materialInput.addEventListener('input', calculateResults);
    if (markupInput) markupInput.addEventListener('input', calculateResults);

    // Navigation Logic [cite: 2026-02-28]
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
