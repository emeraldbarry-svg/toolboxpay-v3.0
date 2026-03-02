/**
 * TOOLBOXPAY ENGINE v59.0
 * Architecture: Stable Shell / Volatile Engine
 */

const APP_VERSION = "001";

// --- IMMUTABLE BOOT SYSTEM ---
boot();

function boot() {
    ensureVersion();
    attachGlobalListeners();
    render(); // Initial draw
}

function ensureVersion() {
    if (localStorage.getItem("app_version") !== APP_VERSION) {
        // Migration logic could go here; for now, fresh start for schema alignment
        localStorage.clear();
        localStorage.setItem("app_version", APP_VERSION);
    }
}

const store = {
    prefix: APP_VERSION,
    get(key) { return localStorage.getItem(this.prefix + "_" + key); },
    set(key, value) { localStorage.setItem(this.prefix + "_" + key, value); }
};

// --- VOLATILE UI LOGIC (Gemini Refactor Zone) ---

function render(activeTab = 'profile') {
    const app = document.getElementById("app");
    
    const views = {
        profile: `
            <div class="card">
                <h2>Business Profile</h2>
                <label>Trading Name</label>
                <input data-model="trading_name" placeholder="e.g. Acme Plumbing" />
                <label>Specialising In</label>
                <input data-model="specialising" placeholder="Labour type..." />
            </div>`,
        bank: `
            <div class="card">
                <h2>Bank Details</h2>
                <label>Bank Name</label>
                <input data-model="bank_name" />
                <label>Sort Code</label>
                <input data-model="sort_code" />
            </div>`,
        calc: `
            <div class="card">
                <h2>Job Calculator</h2>
                <label>Labour (£)</label>
                <input type="number" data-model="cost_labour" data-calc="total" />
                <label>Materials (£)</label>
                <input type="number" data-model="cost_mats" data-calc="total" />
                <div class="res-box">Total: <span id="out_total">£0.00</span></div>
            </div>`
    };

    app.innerHTML = `
        <header><span style="color:#FF8C00">TOOLBOX</span>PAY</header>
        <nav class="nav-reel">
            <button class="nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-action="tab" data-value="profile">PROFILE</button>
            <button class="nav-btn ${activeTab === 'bank' ? 'active' : ''}" data-action="tab" data-value="bank">BANK</button>
            <button class="nav-btn ${activeTab === 'calc' ? 'active' : ''}" data-action="tab" data-value="calc">CALC</button>
        </nav>
        <main>${views[activeTab] || views.profile}</main>
    `;

    hydrate();
}

// --- DELEGATED EVENT SYSTEM ---

function attachGlobalListeners() {
    // Click Delegation
    document.addEventListener("click", e => {
        const action = e.target.dataset.action;
        if (!action) return;

        const handlers = {
            tab: () => render(e.target.dataset.value),
            save: () => console.log("Manual Save Triggered")
        };

        handlers[action]?.();
    });

    // Input/Model Delegation
    document.addEventListener("input", e => {
        const model = e.target.dataset.model;
        if (model) {
            store.set(model, e.target.value);
        }
        
        // Live Calc Trigger
        if (e.target.dataset.calc) {
            calculate();
        }
    });
}

function hydrate() {
    document.querySelectorAll("[data-model]").forEach(el => {
        el.value = store.get(el.dataset.model) || "";
    });
    calculate(); // Ensure totals are right on view swap
}

function calculate() {
    const l = parseFloat(document.querySelector('[data-model="cost_labour"]')?.value) || 0;
    const m = parseFloat(document.querySelector('[data-model="cost_mats"]')?.value) || 0;
    const out = document.getElementById("out_total");
    if (out) out.innerText = "£" + (l + m).toFixed(2);
}

// Runtime Crash Protection
window.addEventListener("error", e => {
    console.error("Engine failure prevented:", e.message);
});
